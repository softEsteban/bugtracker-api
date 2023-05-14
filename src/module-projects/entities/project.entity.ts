import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sch_projects.tb_project' })
export class Project {
    @PrimaryGeneratedColumn()
    pro_code: number;

    @Column()
    pro_title: string;

    @Column()
    pro_descri: string;

    @Column()
    pro_status: string;

    @Column()
    pro_datins: Date;

    @Column()
    pro_datupd: Date;

    @Column()
    use_code: string;

    @Column({ type: 'timestamp' })
    pro_datstart: Date;

    @Column({ type: 'timestamp' })
    pro_datend: Date;
}