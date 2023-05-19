import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { validate } from 'class-validator';
import { USQL } from 'src/module-utilities/usql';
import { ItemCreate } from '../dtos/create.item.dto';

@Injectable()
export class ItemsService {

    constructor(
        private uSql: USQL) {

    }

    contextClass = "ItemsService - ";

    async getItemsCountByType() {
        const method = `${this.contextClass} getItemsCountByType`;
        try {
            let itemsCount = await this.uSql.makeQuery(`
                SELECT item_type, COUNT(*) item_count
                FROM sch_projects.tb_item
                GROUP BY item_type
            `, [])

            if (!itemsCount.length) {
                return {
                    result: 'success',
                    message: "No items were found",
                };
            }
            return { result: "success", data: itemsCount, message: "Items count retrieved" };
        } catch (e) {
            console.log("Exception at: " + method);
        }
    }

    async getAllTicketsByProject(projectId: string) {
        const method = `${this.contextClass} getAllTicketsByProject`;
        try {
            let tickets = await this.uSql.makeQuery(`
            SELECT  *
            FROM 
                sch_projects.tb_item item
            WHERE 
                item.item_type = 'Ticket' AND item.pro_code = $1
            ORDER BY item.item_datins DESC
            `, [projectId])

            if (!tickets.length) {
                return {
                    result: 'success',
                    message: "No tickets were found",
                };
            }
            return { result: "success", data: tickets, message: "All tickets retrieved" };
        } catch (e) {
            console.log("Exception at: " + method);
        }
    }

    async getAllIssuesByProject(projectId: string) {
        const method = `${this.contextClass} getAllIssuesByProject`;
        try {
            let issues = await this.uSql.makeQuery(`
            SELECT  *
            FROM 
                sch_projects.tb_item item
            WHERE 
                item.item_type = 'Issue' AND item.pro_code = $1
            ORDER BY item.item_datins DESC
            `, [projectId])

            if (!issues.length) {
                return {
                    result: 'success',
                    message: "No issues were found",
                };
            }
            return { result: "success", data: issues, message: "All issues retrieved" };
        } catch (e) {
            console.log("Exception at: " + method);
        }
    }

    async createItem(createItem: ItemCreate) {
        try {
            // Perform input validation using class-validator decorators
            const errors = await validate(createItem);
            if (errors.length > 0) {
                return {
                    result: 'fail',
                    message: 'Some values are not correct or are missing',
                    data: '',
                };
            }

            // Perform database insert and return created item
            const query = `
            INSERT INTO sch_projects.tb_item
            (item_title, item_descri, item_type, item_status, item_file, item_datins, item_datupd, pro_code, use_code, coll_code)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6, $7, $8)
            RETURNING item_title, item_descri, item_type, item_status, item_file, item_datins, item_datupd, pro_code, use_code, coll_code`;
            const params = [
                createItem.item_title,
                createItem.item_descri,
                createItem.item_type,
                createItem.item_status,
                createItem.item_file,
                createItem.pro_code,
                createItem.use_code,
                createItem.coll_code,
            ];

            const result = await this.uSql.makeQuery(query, params);
            if (!result[0]) {
                return {
                    result: 'fail',
                    message: "Couldn't create the item",
                };
            }
            const createdItem = result[0];

            return {
                result: 'success',
                message: 'Item has been created',
                data: createdItem,
            };
        } catch (error) {
            throw new InternalServerErrorException(`Error creating item: ${error}`);
        }
    }
}


