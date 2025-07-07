import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Animal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    age: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    temperament: string;

    @Column({ type: 'text', nullable: true })
    healthNotes: string;

    @Column({ type: 'text', nullable: true })
    backstory: string;

    @Column({ type: 'text', nullable: true })
    idealHome: string;

    @CreateDateColumn()
    createdAt: Date;
} 