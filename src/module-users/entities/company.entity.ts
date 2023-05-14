import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "sch_domains.tb_company" })
export default class Company {
    @PrimaryGeneratedColumn()
    cop_code: number;

    @Column()
    cop_name: string;

    @Column()
    cop_config: string;
}
