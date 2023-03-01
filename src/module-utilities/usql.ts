import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class USQL {
    constructor(@InjectEntityManager()
    private readonly entityManager: EntityManager) { }

    async makeQuery(query: string, parameters: any[]) {
        try {
            return this.entityManager.query(query, parameters);
        } catch (error) {
            return "Error: " + error;
        }
    }

}
