use anchor_lang::prelude::*;

#[account]
pub struct Stadium {
    pub score: u64,
    pub bases: u64,
    pub admin_key: Pubkey,
}

// An account that goes inside a transaction instruction
#[account]
pub struct PlayerAccount {
    pub score: u64,
}