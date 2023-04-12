import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { validate } from 'class-validator';
import { USQL } from 'src/module-utilities/usql';

@Injectable()
export class ItemsService {

    constructor(
        private uSql: USQL) {

    }

    contextClass = "ItemsService - ";

    async getAllTicketsByProject(projectId: string) {
        const method = `${this.contextClass} getAllTicketsByProject`;
        try {
            let tickets = await this.uSql.makeQuery(`
            SELECT  *
            FROM 
                sch_projects.tb_item item
            WHERE 
                item.item_type = 'Ticket' AND item.pro_code = $1
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


}
