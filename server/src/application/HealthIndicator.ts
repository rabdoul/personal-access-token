export enum Health {
    OK, KO
}

export interface HealthIndicator {
    name(): string
    health(): Promise<Health>
}