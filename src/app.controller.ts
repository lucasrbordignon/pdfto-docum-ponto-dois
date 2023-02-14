import { Controller, Post, Body } from '@nestjs/common';
import { Buffer } from 'buffer';
import { PdfApi } from 'asposepdfcloud';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor() {}

  @Post('/pdf-to-doc')
  async pdfToDoc(@Body() body: any) {

    const { name, resultName, dir } = body
    const SrcFile = `/${name}`;
    const resultPath = `MyFolder/ ${resultName}`;
    const storageName = 'AppStorage';
    const fileToWrite = `${dir}/${resultName}`;
    const pdfApi = new PdfApi(
      '31142b24-ad39-48c9-99c3-ebe1f061a8da',
      '2972ac0203e5a649ddaf7f786e332bf3',
    );
    try {
      const data = fs.readFileSync(name);
      await pdfApi.uploadFile(SrcFile, Buffer.from(data), storageName);
      await pdfApi.putPdfInStorageToDoc(
        name,
        resultPath,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        storageName,
      );

      // Baixar pdf do armazenamento em nuvem
      const fileData = await pdfApi.downloadFile(resultPath, storageName, '');
      const writeStream = fs.createWriteStream(fileToWrite);
      writeStream.write(fileData.body);
      return Buffer.from(data).toString('base64')
    } catch (e) {
      throw e;
    }
  }

  @Post('/addPDF')
  async addPDf(@Body() body: any): Promise<string> {
    const { name, stringToDecode } = body

    fs.writeFile(name, stringToDecode, 'base64', (error) => {
      if (error) throw error.message;
      console.log("PDF salvo!");
    });
    return 'Sucesso'
  }
}
