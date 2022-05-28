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
    let power = batting_param / 16;
    let control = (255u8 - batting_param) / 16;
    let sprint = sprinter_param % 16;

    let salt_1: i64 = salt_1.into();
    let dice: u8 = ((seed * salt_1) % 64).abs().try_into().unwrap();

    if dice >= 32 {
        return 0;   // 50% out
    }

    if power/4 >= dice {
        return 4;   // homerun
    }

    let mut tmp_result;
    if power >= dice {
        tmp_result = 2;   // double
    } else if (power + control/4) >= dice {
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