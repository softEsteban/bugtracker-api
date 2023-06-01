import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sch_projects.tb_item' })
export class Item {
    @PrimaryGeneratedColumn()
    item_code: number;

    @Column()
    item_title: string;

    @Column()
    item_descri: string;

    @Column()
    item_type: string;

    @Column()
    item_status: string;

    @Column()
    item_datins: Date;

    @Column()
    item_datupd: Date;

    @Column()
    use_code: string;

    @Column()
    pro_code: string;

    @Column()
    coll_code: string;

}