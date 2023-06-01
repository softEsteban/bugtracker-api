import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sch_projects.tb_item_document' })
export class ItemDocument {
    @PrimaryGeneratedColumn()
    doc_code: number;

    @Column()
    doc_title: string;

    @Column()
    doc_descri: string;

    @Column()
    doc_public: string;

    @Column()
    doc_type: string;

    @Column()
    doc_url: string;

    @Column()
    doc_datins: Date;

    @Column()
    doc_datupd: Date;

    @Column()
    use_code: string;

    @Column()
    item_code: string;
}