import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateItemDoc {
    @IsString()
    @ApiProperty({ description: "The item's document title" })
    doc_title: string;

    @IsString()
    @ApiProperty({ description: "The item's document description" })
    doc_descri: string;

    @IsString()
    @ApiProperty({ description: "The item's document accesibility" })
    doc_public: string;

    @IsString()
    @ApiProperty({ description: "The item's document type" })
    doc_type: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "The item's document file" })
    doc_url: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "The item's document item code" })
    item_code: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "The item's document user code" })
    use_code: string;



    constructor(
        doc_public: string,
        doc_url: string,
        doc_type: string,
        item_code: string,
        use_code: string,
        doc_title?: string,
        doc_descri?: string

    ) {
        this.doc_public = doc_public;
        this.doc_url = doc_url;
        this.doc_type = doc_type;
        this.item_code = item_code;
        this.use_code = use_code;
        this.doc_title = doc_title;
        this.doc_descri = doc_descri;
    }
}
