pub mod stadium;

use anchor_lang::prelude::*;

declare_id!("9Kkk5Cp6NfvXEyt7oeX9ihYcwkczBSxTkUemprpxEkEe");

#[program]
pub mod mysolanaapp {
    use anchor_lang::solana_program::entrypoint::ProgramResult;

    use crate::stadium::account::*;

    use super::*;

    pub fn init_game(ctx: Context<InitGame>) -> ProgramResult {
        let stadium = &mut ctx.accounts.stadium;
        stadium.bases = 0;
        stadium.score = 0;
        stadium.admin_key = *ctx.accounts.admin.key;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        let base_account = &mut ctx.accounts.player;
        base_account.score += 1;
        Ok(())
    }

    pub fn play(ctx: Context<Play>) -> ProgramResult {
        let player = &mut ctx.accounts.player;
        player.score += 1;

        let stadium = &mut ctx.accounts.stadium;
        stadium.score += 1;
        Ok(())
    }

    // Transaction instructions
    #[derive(Accounts)]
    pub struct InitGame<'info> {
        #[account(init, payer = admin, space = 16 + 16)]
        pub stadium: Account<'info, Stadium>,
        #[account(mut)]
        pub admin: Signer<'info>,
        pub system_program: Program <'info, System>,
    }

    // Transaction instructions
    #[derive(Accounts)]
    pub struct Increment<'info> {
        #[account(mut)]
        pub player: Account<'info, PlayerAccount>,
    }

    #[derive(Accounts)]
    pub struct Play<'info> {
        #[account(mut)]
        pub stadium: Account<'info, Stadium>,
        #[account(mut, signer)]
        pub player: Account<'info, PlayerAccount>,
        pub system_program: Program <'info, System>,
    }
}
