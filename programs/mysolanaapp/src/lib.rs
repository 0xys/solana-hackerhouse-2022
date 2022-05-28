use anchor_lang::prelude::*;

declare_id!("9Kkk5Cp6NfvXEyt7oeX9ihYcwkczBSxTkUemprpxEkEe");

#[account]
pub struct Stadium {
    pub score: u64,
    pub bases: u8,
    pub outs: u8,
    pub authority: Pubkey,
    pub epoch: u64,
}

// An account that goes inside a transaction instruction
#[account]
pub struct PlayerAccount {
    pub authority: Pubkey,      // account autorizing play
    pub score: u64,
}

#[program]
pub mod mysolanaapp {
    use anchor_lang::solana_program::entrypoint::ProgramResult;

    use super::*;

    pub fn init_game(ctx: Context<InitGame>) -> ProgramResult {
        let stadium = &mut ctx.accounts.stadium;
        stadium.bases = 0;
        stadium.outs = 0;
        stadium.score = 0;
        stadium.epoch = 0;
        stadium.authority = *ctx.accounts.authority.key;
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
        #[account(init, payer = authority, space = 8 + 50)]
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

    #[derive(Accounts)]
    pub struct Play<'info> {
        #[account(mut)]
        pub stadium: Account<'info, Stadium>,
        #[account(mut, has_one = authority)]
        pub player: Account<'info, PlayerAccount>,
        pub authority: Signer<'info>,
        pub system_program: Program <'info, System>,
    }
}
