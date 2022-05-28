
export interface Stadium {
    bases: number,
    outs: number,
    score: string,
}

export interface Player {
    score: string,
    lastPlay: number,
    lastScore: number,
    power: number,
    control: number,
    sprint: number,
}