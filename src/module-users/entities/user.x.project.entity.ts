import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ name: "sch_projects.tb_user_x_project" })
export default class UserXProject {

    // @OneToOne(() => User)
    // @JoinColumn()
    @PrimaryGeneratedColumn()
    use_code: string;

    // @OneToOne(() => Project)
    // @JoinColumn()
    @PrimaryGeneratedColumn()
    pro_code: string;

    @Column()
    usp_datins: Date;


}


function PrimaryColumn(): (target: UserXProject, propertyKey: "use_code") => void {
    throw new Error('Function not implemented.');
}
// function OneToOne(): (target: User, propertyKey: "pro_code") => void {
//     throw new Error('Function not implemented.');
// }
// function JoinColumn(): (target: User, propertyKey: "pro_code") => void {
//     throw new Error('Function not implemented.');
// }

