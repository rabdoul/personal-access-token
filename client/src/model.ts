export type Activity = { id: string; order: number; enabled: boolean };

export type Sequencing = { splitCommandProducts: boolean; numberOfProductOrders: number };
export type ValidateMTMProduct = { stopOnOutOfRangeWarning: boolean; stopOnIncorrectValueWarning: boolean };
