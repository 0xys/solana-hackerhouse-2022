pub mod processor;

use anchor_lang::prelude::*;

declare_id!("ATSPEhRAUhpdLQcEjdWYuB9BNJv3iABoTdnCug54Ruye");

#[account]
pub struct Stadium {
    pub score: u64,
    pub bases: u8,
    pub outs: u8,
    pub authority: Pubkey,
    pub epoch: u64,
    pub num_of_players: u64,
}

#[account]
pub struct PlayerAccount {
    pub owner: Pubkey,
    pub score: u64,
    pub last_play: u8,
    pub last_score: u8,
}

#[program]
pub mod mysolanaapp {
    use anchor_lang::solana_program::{entrypoint::ProgramResult};

    use crate::processor::play_inner;

    use super::*;

    pub fn init_game(ctx: Context<InitGame>) -> ProgramResult {
        let stadium = &mut ctx.accounts.stadium;
        stadium.bases = 0;
        stadium.outs = 0;
        stadium.score = 0;
        stadium.epoch = 0;
        stadium.authority = *ctx.accounts.authority.key;
        stadium.num_of_players = 0;
        Ok(())
    }

    pub fn reset(ctx: Context<Reset>) -> ProgramResult {
        let stadium = &mut ctx.accounts.stadium;
        stadium.bases = 0;
        stadium.score = 0;
        stadium.outs = 0;
        stadium.epoch += 1;
        Ok(())
    }

    pub fn register_player(ctx: Context<RegisterPlayer>) -> ProgramResult {
        let player = &mut ctx.accounts.player;
        player.score = 0;
        player.owner = *ctx.accounts.player_owner.key;

        let stadium = &mut ctx.accounts.stadium;
        stadium.num_of_players += 1;

        Ok(())
    }

    pub fn play(ctx: Context<Play>) -> ProgramResult {
        let clock = Clock::get()?;
        let token = clock.unix_timestamp;

        play_inner(token, &mut ctx.accounts.player, &mut ctx.accounts.stadium);
        Ok(())
    }

    // Transaction instructions
    #[derive(Accounts)]
    pub struct InitGame<'info> {
        #[account(init, payer = authority, space = 8 + 58)]
        pub stadium: Account<'info, Stadium>,
        #[account(mut)]
        pub authority: Signer<'info>,
        pub system_program: Program <'info, System>,
    }

    // Transaction instructions
    #[derive(Accounts)]
    pub struct Reset<'info> {
        #[account(mut, has_one = authority)]
        pub stadium: Account<'info, Stadium>,
        pub authority: Signer<'info>,
    }

    //    seeds = [&get_player_key_seeds(player_owner.key, program_id)],
    #[derive(Accounts)]
    pub struct RegisterPlayer<'info> {
        #[account(mut)]
        pub stadium: Account<'info, Stadium>,
        #[account(
            init,
            seeds = [&player_owner.key().to_bytes()],
            bump,
            payer = player_owner,
            space = 8 + 42)]
        pub player: Account<'info, PlayerAccount>,
        #[account(mut)]
        pub player_owner: Signer<'info>,
        pub system_program: Program <'info, System>,
    }

    #[derive(Accounts)]
    pub struct Play<'info> {
        #[account(mut)]
        pub stadium: Account<'info, Stadium>,
        #[account(
            mut,
            seeds = [&player_owner.key().to_bytes()],
            bump)]
        pub player: Account<'info, PlayerAccount>,
        pub player_owner: Signer<'info>,
    }
}
