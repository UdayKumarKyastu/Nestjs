import { access, readFile } from 'fs/promises'
import { constants } from 'fs'

import neatCsv from 'neat-csv'
import { Injectable } from '@nestjs/common'

class CantAccessTranslationFile extends Error {}

export interface ICanParseCsv {
  parseFile(filePath: string): Promise<Record<string, string>[]>
}

@Injectable()
export class CsvParserService implements ICanParseCsv {
  async parseFile(filePath: string) {
    await access(filePath, constants.R_OK).catch((e) => {
      throw new CantAccessTranslationFile(e)
    })

    const file = await readFile(filePath, {
      encoding: 'utf-8',
    })

    return neatCsv(file)
  }
}
