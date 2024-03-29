import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { validate } from 'class-validator';
import { USQL } from 'src/module-utilities/usql';
import { CreateItem } from '../dtos/create.item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemDocument } from '../entities/item.doc.entity';
import { Item } from '../entities/item.entity';
import { CreateItemDoc } from '../dtos/create.item.doc.dto';

@Injectable()
export class ItemsService {

    constructor(
        @InjectRepository(ItemDocument) private itemDocRepository: Repository<ItemDocument>,
        @InjectRepository(Item) private itemRepository: Repository<Item>,
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
            SELECT  * , COALESCE((SELECT ARRAY_TO_JSON(ARRAY_AGG(rowt)) AS docs 
                        FROM 
                        (SELECT *
                        FROM sch_projects.tb_item_document docs
                        WHERE docs.item_code = item.item_code) AS rowt), '[]') AS item_docs
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
            SELECT  * , COALESCE((SELECT ARRAY_TO_JSON(ARRAY_AGG(rowt)) AS docs 
                        FROM 
                        (SELECT *
                        FROM sch_projects.tb_item_document docs
                        WHERE docs.item_code = item.item_code) AS rowt), '[]') AS item_docs
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

    async createItem(createItem: CreateItem) {
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

            // Creates a new item instance with the provided data
            const item = this.itemRepository.create({
                item_title: createItem.item_title,
                item_descri: createItem.item_descri,
                item_status: createItem.item_status,
                item_type: createItem.item_type,
                item_datins: new Date(),
                item_datupd: new Date(),
                use_code: createItem.use_code,
                pro_code: createItem.pro_code,
                coll_code: createItem.coll_code,
            });

            // Saves the item doc entity to the database
            const createdItem = await this.itemRepository.save(item);

            // Creates documents
            if (createItem.item_files.length > 0) {
                for (const file of createItem.item_files) {
                    const newDoc = new CreateItemDoc(
                        "Public",
                        file.doc_url,
                        file.doc_type,
                        createdItem.item_code.toString(),
                        createItem.use_code,
                        "",
                        ""
                    );
                    await this.createItemDocument(newDoc);
                }
            }


            return {
                result: 'success',
                message: 'Item has been created',
                data: createdItem,
            };
        } catch (error) {
            throw new InternalServerErrorException(`Error creating item: ${error}`);
        }
    }

    async createItemDocument(createItemDoc: CreateItemDoc) {
        const method = `${this.contextClass} createItemDocument`;

        try {
            // Performs input validation using class-validator decorators
            const errors = await validate(createItemDoc);
            if (errors.length > 0) {
                return {
                    result: 'success',
                    message: 'Some values are not correct or are missing',
                    data: '',
                };
            }

            // Creates a new doc instance with the provided data
            const doc = this.itemDocRepository.create({
                doc_title: createItemDoc.doc_title || '',
                doc_descri: createItemDoc.doc_descri || '',
                doc_url: createItemDoc.doc_url,
                doc_public: createItemDoc.doc_public || '',
                doc_type: createItemDoc.doc_type || '',
                doc_datins: new Date(),
                doc_datupd: new Date(),
                use_code: createItemDoc.use_code,
                item_code: createItemDoc.item_code
            });

            // Saves the item doc entity to the database
            const createdDoc = await this.itemDocRepository.save(doc);

            return { result: 'success', message: 'Document has been created', data: createdDoc };
        } catch (error) {
            throw new InternalServerErrorException(`Error in ${method}: ${error}`);
        }
    }
}


