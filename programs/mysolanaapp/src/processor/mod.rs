use anchor_lang::{prelude::{Account}, Key};

use crate::{Stadium, PlayerAccount};


pub fn play_inner(seed: i64, player: &mut Account<PlayerAccount>, stadium: &mut Account<Stadium>) {
    // let token = entry.blockhash.as_ref()[0];
    let key = player.key().to_bytes();
    
    let batting_param = key[3];
    let sprinter_param = key[4];
    let salt_1 = key[10];
    let salt_2 = key[11];
    let play_result = throw_a_dice(seed, batting_param, sprinter_param, salt_1, salt_2);
    
    match play_result {
        0 => {
            stadium.outs += 1;
            if stadium.outs >= 3 {
                stadium.outs = 0;
                stadium.bases = 0;
            }
        },
        1 => {
            stadium.bases <<= 1;
            stadium.bases += 0x01;
        },
        2 => {
            stadium.bases <<= 2;
            stadium.bases += 0x02;
        },
        3 => {
            stadium.bases <<= 3;
            stadium.bases += 0x04;
        },
        4 => {
            stadium.bases <<= 4;
            stadium.bases += 0x08;
        },
        _ => ()
    }
    let score = calc_score(stadium.bases).into();

    //  clear homein-ed runners
    stadium.bases = stadium.bases & 7;  // bases = bases & 0b0000111

    player.last_score = score;
    player.last_play = play_result;

    let score: u64 = score.into();
    player.score += score;
    stadium.score += score;
}

fn throw_a_dice(seed: i64, batting_param: u8, sprinter_param: u8, salt_1: u8, salt_2: u8) -> u8 {
    let power = batting_param % 16;
    let control = 16 - power;
    let sprint = sprinter_param % 16;

    let salt_1: i64 = salt_1.into();
    let dice: u16 = ((seed * salt_1) % 1000).abs().try_into().unwrap();
    let dice: f32 = dice.try_into().unwrap();
    let dice = dice / 1000f32;

    let power: f32 = power.into();
    let control: f32 = control.into();
    let sprint: f32 = sprint.into();

    let power: f32 = power / 15.0;
    let control: f32 = control / 15.0;
    let sprint: f32 = sprint / 15.0;

    let hit_zone: f32 = 0.24 + (control * 0.21);    // max 0.45
    if dice >= hit_zone {
        return 0;   // out
    }

    let power_zone = hit_zone * power * 0.3;
    if dice < power_zone * 0.25 {
        return 4;   // homerun
    }else if dice < power_zone * 0.9 {
        return 2;   // double
    }else if dice < power_zone {
        return 3;   // triple
    }

    let mut tmp_result;
    if dice < power_zone + (hit_zone - power_zone) * 0.2 {
        tmp_result = 2; // double
    } else {
        tmp_result = 1; // single
    }

    let salt_2: i64 = salt_2.into();
    let dice2: u8 = ((seed * salt_2) % 64).abs().try_into().unwrap();
    if dice2 > 15 {
        return tmp_result
    }
    if sprint >= dice {
        tmp_result += 1;    // run fast
    }

    tmp_result
}

fn calc_score(bases: u8) -> u8 {
    let current = bases;
    let mut home_in_bit = current >> 3;
    let mut total_score: u8 = 0;

    for i in [1,2,4,8] {
        let b = 8 / i;
        let bit_score = home_in_bit / b;
        if bit_score > 0 {
            total_score += bit_score;
            home_in_bit -= b;
        }
    }
    total_score
}

// test
// fn main() {
//     {
//         let mut counts = [0usize; 5];
//         for _ in 0..10000 {
//             let index: usize = get(0, 0).into();
//             counts[index] += 1;
//         }
//         println!("{:?}", counts);
//     }
//     {
//         let mut counts = [0usize; 5];
//         for _ in 0..10000 {
//             let index: usize = get(4, 0).into();
//             counts[index] += 1;
//         }
//         println!("{:?}", counts);
//     }
//     {
//         let mut counts = [0usize; 5];
//         for _ in 0..10000 {
//             let index: usize = get(8, 0).into();
//             counts[index] += 1;
//         }
//         println!("{:?}", counts);
//     }
//     {
//         let mut counts = [0usize; 5];
//         for _ in 0..10000 {
//             let index: usize = get(12, 0).into();
//             counts[index] += 1;
//         }
//         println!("{:?}", counts);
//     }
//     {
//         let mut counts = [0usize; 5];
//         for _ in 0..10000 {
//             let index: usize = get(16, 0).into();
//             counts[index] += 1;
//         }
//         println!("{:?}", counts);
//     }
    
// }

// fn get(power: u8, sprint: u8) -> u8 {
//     let mut rng = rand::thread_rng();
//     let dice: f32 = rng.gen();

//     let control: u8 = 16 - power;

//     //let salt_1: i64 = salt_1.into();
//     //let dice: u16 = ((seed * salt_1) % 1000).abs().try_into().unwrap();
//     //let dice: f32 = dice.try_into().unwrap();
//     //let dice = dice / 1000f32;

//     let power: f32 = power.into();
//     let control: f32 = control.into();
//     let sprint: f32 = sprint.into();

//     let power: f32 = power / 15.0;
//     let control: f32 = control / 15.0;
//     let sprint: f32 = sprint / 15.0;

//     let hit_zone: f32 = 0.24 + (control * 0.21);    // max 0.45
//     if dice >= hit_zone {
//         return 0;   // out
//     }

//     let power_zone = hit_zone * power * 0.3;
//     if dice < power_zone * 0.25 {
//         return 4;   // homerun
//     }else if dice < power_zone * 0.9 {
//         return 2;
//     }else if dice < power_zone {
//         return 3;   // triple
//     }

//     let mut tmp_result;
//     if dice < power_zone + (hit_zone - power_zone) * 0.2 {
//         tmp_result = 2; // double
//     } else {
//         tmp_result = 1; // single
//     }
//     return tmp_result;
// }