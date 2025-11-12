import {
  Table,
  Column,
  Model,
  AllowNull,
  DataType,
  Unique,
} from "sequelize-typescript";

@Table({
  timestamps: true,
})
export class Food extends Model {
  @Unique(true) @AllowNull(false) @Column(DataType.STRING) name!: string;
  @AllowNull(false) @Column(DataType.NUMBER) calories!: number;
  @AllowNull(false) @Column(DataType.NUMBER) fat!: number;
  @AllowNull(false) @Column(DataType.NUMBER) carbs!: number;
  @AllowNull(false) @Column(DataType.NUMBER) protein!: number;
}
