import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

enum ItemType {
    TICKET = "Ticket",
    ISSUE = "Issue",
}

export class ItemCreate {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "The item's title" })
    item_title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "The item's description" })
    item_descri: string;

    @IsString()
    @ApiProperty({
        description: "The item's type",
        enum: ItemType,
        enumName: "ItemType",
        default: ItemType.TICKET,
    })
    item_type: ItemType = ItemType.TICKET;

    @IsString()
    @ApiProperty({ description: "The item's status" })
    item_status: string;

    @IsString()
    @ApiProperty({ description: "The item's file" })
    item_file: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "The item's project code" })
    pro_code: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "The item's user code" })
    use_code: string;

    @IsString()
    @ApiProperty({ description: "The item's collection" })
    coll_code: string;
}
