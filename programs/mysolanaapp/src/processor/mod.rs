use anchor_lang::{prelude::{Account}, Key};

use crate::{Stadium, PlayerAccount};


pub fn play_inner(token: i64, player: &Account<PlayerAccount>, stadium: &mut Account<Stadium>) -> u64 {
    // let token = entry.blockhash.as_ref()[0];
    let player_param: i64 = player.key().to_bytes()[10].into();
    let dice: i64 = token + player_param;
    match dice % 5 {
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
    calc_score(stadium.bases).into()
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