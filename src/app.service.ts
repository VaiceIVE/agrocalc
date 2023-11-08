import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import { Document, Packer, Paragraph, TextRun, AlignmentType, TableRow, TableCell, Table, BorderStyle, UnderlineType, WidthType, VerticalAlign, PrettifyType } from "docx";
import {months} from './constants/months' 
import { productionData } from './constants/productionData';
import { fillersdata } from './constants/fillersData';
import { fancynames } from './constants/fancynames';
import { unfancynames } from './constants/unfancynames';
import * as tmp from 'tmp'
import { join } from 'path';
import { Readable } from 'stream';

@Injectable()
export class AppService {
  async createDocument(data: Record<string, any>){
    const resultvalues = await this.calculate(data)
    console.log('DONE')
    var tablerows = [
      new TableRow({
        cantSplit: true,
        children:
        [
          new TableCell({
            children:
            [
              new Paragraph({
                children: 
                [
                  new TextRun({
                    text: "№ п/п",
                    bold: true
                  })
                ]
              })
            ]
          }),
          new TableCell({
            children:
            [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: 
                [
                  new TextRun({
                    text: "Вид веществ, образуемых при содержании сельскохозяйственных животных, отнесенных к побочным продуктам животноводства",
                    bold: true
                  })
                ]
              })
            ]
          }),
          new TableCell({
            children:
            [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: 
                [
                  new TextRun({
                    text: "Объем (тонны) ______ \n",
                    bold: true
                  }),
                  new TextRun({
                    size: 18,
                    text:"указывается объём  вещества, образуемого при содержании с/х животных"
                  })
                ]
              })
            ]
          }),
          new TableCell({
            children:
            [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: 
                [
                  new TextRun({
                    text: "Дата образования",
                    bold: true
                  })
                ]
              })
            ]
          }),
          new TableCell({
            children:
            [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: 
                [
                  new TextRun({
                    text: "Планируемые сроки использования в сельскохозяй-ственном производстве и результаты такого использования",
                    bold: true
                  })
                ]
              })
            ]
          }),
          new TableCell({
            children:
            [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: 
                [
                  new TextRun({
                    text: "Передача иным лицам и результаты такой передачи (полное и сокращенное (при наличии) наименование юридического лица или фамилия, имя, отчество (при наличии) индивидуального предпринимателя или главы крестьянского (фермерского) хозяйства без образования юридического лица, которому переданы побочные продукты животноводства, описание результата передачи)",
                    bold: true
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
    tablerows.push(
      new TableRow({
        cantSplit: true,
        children:[
          new TableCell({
            children:[
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children:
                [
                  new TextRun({
                    text: "1",
                    bold: true,

                  })
                ]
              })
            ]
          }),
          new TableCell({
            children:[
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children:
                [
                  new TextRun({
                    text: "2",
                    bold: true,

                  })
                ]
              })
            ]
          }),
          new TableCell({
            children:[
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children:
                [
                  new TextRun({
                    text: "3",
                    bold: true,

                  })
                ]
              })
            ]
          }),
          new TableCell({
            children:[
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children:
                [
                  new TextRun({
                    text: "4",
                    bold: true,

                  })
                ]
              })
            ]
          }),
          new TableCell({
            children:[
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children:
                [
                  new TextRun({
                    text: "5",
                    bold: true,

                  })
                ]
              })
            ]
          }),
          new TableCell({
            children:[
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children:
                [
                  new TextRun({
                    text: "6",
                    bold: true,

                  })
                ]
              })
            ]
          }),
        ]
      })
    )
    var i = 1
    console.log(resultvalues)
    for (const type in resultvalues)
    {
      console.log("own: " + data.works[type].ownValue)
      console.log("transfer: " + data.works[type].transferValue)
      tablerows.push(
        new TableRow({
          cantSplit: true,
          children:[
            new TableCell({
              children:[
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children:
                  [
                    new TextRun({
                      text: i.toString() + '.',
                      italics: true
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              children:[
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children:
                  [
                    new TextRun({
                      text: type,
                      italics: true
  
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              children:[
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children:
                  [
                    new TextRun({
                      text: resultvalues[type],
                      italics: true
  
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              children:[
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children:
                  [
                    new TextRun({
                      text: data.beddingPeriod,
                      italics: true
  
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              children:[
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children:
                  [
                    new TextRun({
                      text: `${data.works[type].ownValue  > 0 ? `Планируемые сроки использования: ${data.works[type].period} 
                      Результат использования: ${data.works[type].ownResult == "making" ? 
                     `производство органического удобрения (№${data.works[type].number} свидетельства о государственной регистрации на пестицид и агрохимикат) в количестве ` + data.works[type].ownValue : 
                     'улучшение плодородия земель в объеме ' + data.works[type].ownValue}` : '-'}`,
                      italics: true
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              children:[
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children:
                  [
                    new TextRun({
                      text: `${data.works[type].transferValue > 0 ? `Передача побочных продуктов животноводства ${data.works[type].name} 
                      Результат использования: ${data.works[type].transferResult == "making" ? 
                     `производство органического удобрения в количестве ` + data.works[type].transferValue: 
                     'улучшение плодородия земель в объеме ' + data.works[type].transferValue}` : '-'}`,
                      italics: true
  
                    })
                  ]
                })
              ]
            }),
          ]
        })
      )
      i++;
    }
    console.log(tablerows)
    const doc = await new Document({
      sections: [
          {
              properties: {},
              children: [
                  new Paragraph({

                      alignment: AlignmentType.CENTER,
                      children:
                      [
                        new TextRun({
                          size: 26,
                          characterSpacing: 100,
                          text: "Уведомление",
                          bold: true,
                          italics: false,
                          allCaps: true
                        }),
                        
                      ],                      
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children:[
                      new TextRun({
                        size: 26,
                        bold: true,
                        text: `об отнесении веществ, образуемых при содержании сельскохозяйственных животных, к побочным продуктам животноводства на `,
                      }),
                      new TextRun({
                        size: 26,
                        bold: true,
                        text: `  ${data.year}  `,
                        underline: {
                          type: UnderlineType.SINGLE,
                          color: "990011",
                        },
                        italics: true,
                      }),
                      new TextRun({
                        bold: true,
                        size: 26,
                        text: " год"
                      })
                    ]
                  }),
                  new Paragraph({}),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children:[
                      new TextRun({
                        size: 26,
                        bold: true,
                        text: `от`,
                      }),
                      new TextRun({
                        size: 26,
                        bold: false,
                        text: `«`,
                      }),
                      new TextRun({
                        size: 26,
                        bold: false,
                        italics: true,
                        underline: {
                          type: UnderlineType.SINGLE,
                          color: "990011",
                        },
                        text: ` ${data.dateBeg.split('.')[0]} `,
                      }),
                      new TextRun({
                        size: 26,
                        bold: false,
                        text: `»`,
                      }),
                      new TextRun({
                        size: 26,
                        bold: false,
                        italics: true,
                        underline: {
                          type: UnderlineType.SINGLE,
                          color: "990011",
                        },
                        text: `  ${months[data.dateBeg.split('.')[1]]}  `,
                      }),
                      new TextRun({
                        size: 26,
                        bold: true,
                        text: `20`,
                      }),
                      new TextRun({
                        size: 26,
                        bold: false,
                        text: `${(data.dateBeg.split('.')[2])}`,
                        underline: {
                          type: UnderlineType.SINGLE,
                          color: "990011",
                        },
                        italics: true,
                      }),
                      new TextRun({
                        size: 26,
                        bold: true,
                        text: `г.`,
                      }),
                    ]
                  })
                  ,
                  new Paragraph({}),
                  new Paragraph({
                    children:[
                      new TextRun({
                        text: "Вид уведомления (нужное отметить):"
                      })
                    ]
                  }),
                  new Paragraph({}),
                  new Table({
                    width: {
                      size: 4660,
                      type: WidthType.DXA,
                  },
                    rows:[
                      new TableRow({
                        children:[
                          new TableCell({
                            width: {
                              size: 3400,
                              type: WidthType.DXA,
                          },
                            children:[
                              new Paragraph({
                                spacing: {after: 60, before: 60},
                                text: "Первичное"
                              }),
                            ]
                          }),
                          new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            width: {
                              size: 1260,
                              type: WidthType.DXA,
                          },
                            children:[
                              new Paragraph(data.type == "primary" ?{
                                spacing: {after: 60, before: 60},
                                alignment: AlignmentType.CENTER,
                                children:[
                                  new TextRun({
                                    size: 28,
                                    text: "X",
                                    italics: true
                                  })
                                ]
                              } : {})
                            ]
                          })
                        ]
                      }),
                      new TableRow({
                        children:[
                          new TableCell({
                            width: {
                              size: 3400,
                              type: WidthType.DXA,
                          },
                            children:[
                              new Paragraph(data.type == "corrective" ? {
                                spacing: {after: 60, before: 60},
                                children:[
                                  new TextRun({
                                    
                                    text: `Корректирующее (в дополнение к уведомлению от `
                                  }),
                                  new TextRun({
                                    underline: {
                                      type: UnderlineType.SINGLE,
                                      color: "990011",
                                    },
                                    text: `${data.primaryDate}`
                                  }),
                                  new TextRun({
                                    text: ` № `
                                  }),
                                  new TextRun({
                                    underline: {
                                      type: UnderlineType.SINGLE,
                                      color: "990011",
                                    },
                                    text: ` ${data.primaryNumber}`
                                  }),
                                  new TextRun({
                                    text: `)`
                                  }),
                                ],
                              }: 
                                {
                                  text: `Корректирующее (в дополнение к уведомлению от _____ № _____)`
                                }),
                            ]
                          }),
                          new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            width: {
                              size: 1260,
                              type: WidthType.DXA,
                          },
                            children:[
                              new Paragraph(data.type == "corrective" ?{
                                spacing: {after: 60, before: 60},
                                alignment: AlignmentType.CENTER,
                                children:[
                                  new TextRun({
                                    size: 28,
                                    text: "X",
                                    italics: true
                                  })
                                ]
                              } : {})
                            ]
                          })
                        ]
                      })
                    ]
                    
                  }),
                  new Paragraph({
                    spacing: {before: 480, after: 480},
                    alignment: AlignmentType.CENTER,
                    children:[
                      new TextRun({
                        size: 26,
                        text: "на основании статьи 5 Федерального закона от 14 июля 2022 г. № 248-ФЗ «О побочных продуктах животноводства и о внесении изменений в отдельные законодательные акты Российской Федерации»"
                      })
                    ]
                  }),
                  new Table({
                    width: {type: WidthType.PERCENTAGE, size: 100},
                    rows:
                    [
                      new TableRow({
                        children:[
                          new TableCell({
                            
                            borders: {
                              bottom: {style: BorderStyle.SINGLE, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children:[
                                  new TextRun({
                                    size: 24,
                                    text: `${data.name}`,
                                    italics: true
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: {after: 240},
                    children:[
                      new TextRun({
                        size: 19,
                        text:`(полное и сокращенное (при наличии) наименование юридического лица или фамилия, имя, отчество (при наличии) индивидуального предпринимателя или главы крестьянского (фермерского) хозяйства без образования юридического лица, идентификационный номер налогоплательщика (при наличии), сведения о государственной регистрации юридического лица или в качестве индивидуального предпринимателя или главы крестьянского (фермерского) хозяйства без образования юридического лица, код причины постановки на учет (для юридического лица или обособленного подразделения юридического лица)`
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: {after: 240},
                    children:[
                      new TextRun({
                        size: 26,
                        text: 'уведомляет'
                      })
                    ]
                  }),
                  new Table({
                    width: {type: WidthType.PERCENTAGE, size: 100},
                    rows:
                    [
                      new TableRow({
                        children:[
                          new TableCell({
                            
                            borders: {
                              bottom: {style: BorderStyle.SINGLE, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children:[
                                  new TextRun({
                                    italics: true,
                                    size: 24,
                                    text: `Управление федеральной службы по ветеринарному и фитосанитарному надзору по Омской Области`
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: {after: 120},
                    children:[
                      new TextRun({
                        size: 19,
                        text: "(наименование территориального управления Федеральной службы по ветеринарному и фитосанитарному надзору)"
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: {after: 240},
                    children:[
                      new TextRun({
                        size: 26,
                        text: 'об отнесении веществ, образуемых при содержании сельскохозяйственных животных на земельном участке:'
                      })
                    ]
                  }),
                  new Table({
                    width: {type: WidthType.PERCENTAGE, size: 100},
                    rows:
                    [
                      new TableRow({
                        children:[
                          new TableCell({
                            
                            borders: {
                              bottom: {style: BorderStyle.SINGLE, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children:[
                                  new TextRun({
                                    italics: true,
                                    size: 24,
                                    text: `${data.address}`
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: {after: 120},

                    children:[
                      new TextRun({
                        size: 19,
                        text: "место нахождения и кадастровый номер земельного участка (при наличии) или адрес (адресный ориентир)"
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: {after: 240},
                    children:[
                      new TextRun({
                        size: 26,
                        text: 'к побочным продуктам животноводства:'
                      })
                    ]
                  }),
                  new Paragraph({
                    pageBreakBefore: true,
                  }),
                  new Table({
                    
                    columnWidths: [7, 20, 13, 12, 18, 30],
                    width: {type: WidthType.PERCENTAGE, size: 100},
                    rows: tablerows
                  }),
                  new Paragraph({
                  }),
                  new Paragraph({
                  }),
                  new Paragraph({
                  }),
                  new Table({
                    
                    columnWidths: [48, 1, 40, 1, 15],
                    alignment: AlignmentType.CENTER,
                    width: {type: WidthType.PERCENTAGE, size: 90},
                    rows: [
                      new TableRow({
                        children:[
                          new TableCell({
                            borders: {
                              bottom: {style: BorderStyle.SINGLE, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children:
                                [
                                  new TextRun({
                                    text: "",
                                    bold: true,
                
                                  })
                                ]
                              })
                            ]
                          }),
                          new TableCell({
                            borders: {
                              bottom: {style: BorderStyle.NIL, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children:
                                [
                                  new TextRun({
                                    text: "/",
                
                                  })
                                ]
                              })
                            ]
                          }),
                          new TableCell({
                            borders: {
                              bottom: {style: BorderStyle.SINGLE, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children:
                                [
                                  new TextRun({
                                    text: "",
                                    bold: true,
                
                                  })
                                ]
                              })
                            ]
                          }),
                          new TableCell({
                            borders: {
                              bottom: {style: BorderStyle.NIL, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children:
                                [
                                  new TextRun({
                                    text: "/",
                
                                  })
                                ]
                              })
                            ]
                          }),
                          new TableCell({
                            borders: {
                              bottom: {style: BorderStyle.SINGLE, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children:
                                [
                                  new TextRun({
                                    text: "",
                                    bold: true,
                
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      }),


                      new TableRow({
                        cantSplit: true,
                        children:[
                          new TableCell({
                            borders: {
                              bottom: {style: BorderStyle.NIL, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.LEFT,
                                children:
                                [
                                  new TextRun({
                                    text: "должность руководителя (уполномоченного представителя) юридического лица либо указание на индивидуального предпринимателя или главу главой крестьянского (фермерского) хозяйства без образования юридического лица",
                                    size: 19
                
                                  })
                                ]
                              })
                            ]
                          }),
                          new TableCell({
                            borders: {
                              bottom: {style: BorderStyle.NIL, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children:
                                [
                                  new TextRun({
                                    text: "",
                
                                  })
                                ]
                              })
                            ]
                          }),
                          new TableCell({
                            borders: {
                              bottom: {style: BorderStyle.NIL, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children:
                                [
                                  new TextRun({
                                    text: "фамилия, имя, отчество (при наличии)",
                                    size: 19
                
                                  })
                                ]
                              })
                            ]
                          }),
                          new TableCell({
                            borders: {
                              bottom: {style: BorderStyle.NIL, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children:
                                [
                                  new TextRun({
                                    text: "",
                
                                  })
                                ]
                              })
                            ]
                          }),
                          new TableCell({
                            borders: {
                              bottom: {style: BorderStyle.NIL, color: '000000'},
                              top: {style: BorderStyle.NIL},
                              right: {style: BorderStyle.NIL},
                              left: {style: BorderStyle.NIL}
                          },
                            children:[
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children:
                                [
                                  new TextRun({
                                    text: "подпись",
                                    size: 19
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      }),
                    ]
                  }),
                  new Paragraph({
                  }),
                  new Paragraph({
                  }),
                  new Paragraph({
                    indent: {left: 400},
                    children:[
                      new TextRun({
                        text: "Номер телефона: "
                      }),
                      new TextRun({
                        text: "+7***-***-**-**    ",
                        underline: {
                          type: UnderlineType.SINGLE,
                          color: "990011",
                        },
                      })
                    ]
                  }),
                  new Paragraph({
                  }),
                  new Paragraph({
                    indent: {left: 400},
                    children:[
                      new TextRun({
                        text: "Адрес электронной почты (при наличии)"
                      }),
                      new TextRun({
                        text: "                              ",
                        underline: {
                          type: UnderlineType.SINGLE,
                          color: "990011",
                        },
                      })
                    ]
                  }),
                  new Paragraph({
                  }),
                  new Paragraph({
                  }),
                  new Paragraph({
                    indent: {left: 400},
                    children:[
                      new TextRun({
                        text: "М.П. (при наличии)"
                      }),
                    ]
                  }),












              ],
          },
      ],
  });

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("myfile.docx", buffer);
});

  return await Packer.toBuffer(doc)
  
  }
  async sendFile(): Promise<Readable>
  {
    return fs.createReadStream("myfile.docx")
  }

  async calculate(data : Record<string, any>)
  {
    let result = {}
    const beddingdiff = data.beddingDiff
    const unlineddiff = data.unlinedDiff
    //Считаем подстилочный по формуле
    if (data.Головы)
    {
      
    for (const breed in data.Головы.подстилочный)
    {
      for (const subbreed in data.Головы.подстилочный[breed])
      {
        if (!(typeof data.Головы.подстилочный[breed][subbreed] == 'number'))
        {
          for (const subsubbreed in data.Головы.подстилочный[breed][subbreed])
          {
            console.log(breed + ' ' + subbreed)
            console.log('data' + data.Головы.подстилочный[breed][subbreed][subsubbreed])
            console.log('proddata' + productionData[breed][subbreed][subsubbreed])
            console.log('filters' + fillersdata[breed][subbreed][subsubbreed])
            if(result[breed + "(подстилочный)"])
            {
              result[breed + "(подстилочный)"] += beddingdiff * (data.Головы.подстилочный[breed][subbreed][subsubbreed] * productionData[breed][subbreed][subsubbreed] + data.Головы.подстилочный[breed][subbreed][subsubbreed] * fillersdata[breed][subbreed][subsubbreed])/1000
            }
            else
            {
              result[breed + "(подстилочный)"] = beddingdiff * (data.Головы.подстилочный[breed][subbreed][subsubbreed] * productionData[breed][subbreed][subsubbreed] + data.Головы.подстилочный[breed][subbreed][subsubbreed] * fillersdata[breed][subbreed][subsubbreed])/1000
            }
          }
        }
        else
        {
          console.log(breed)
          if(result[breed + "(подстилочный)"])
          {
            result[breed + "(подстилочный)"] += beddingdiff * (data.Головы.подстилочный[breed][subbreed] * productionData[breed][subbreed] + data.Головы.подстилочный[breed][subbreed] * fillersdata[breed][subbreed])/1000
          }
          else
          {
            result[breed + "(подстилочный)"] = beddingdiff * (data.Головы.подстилочный[breed][subbreed] * productionData[breed][subbreed] + data.Головы.подстилочный[breed][subbreed] * fillersdata[breed][subbreed])/1000
          }
        }
        }
      }
          // Считаем бесподстилочный
    for (const breed in data.Головы.бесподстилочный)
      {
        for (const subbreed in data.Головы.бесподстилочный[breed])
        {
          if (!(typeof data.Головы.бесподстилочный[breed][subbreed] == 'number'))
          {
            for (const subsubbreed in data.Головы.бесподстилочный[breed][subbreed])
            {
              if(result[breed + "(бесподстилочный)"])
              {
                result[breed + "(бесподстилочный)"] += unlineddiff * data.Головы.бесподстилочный[breed][subbreed][subsubbreed] * productionData[breed][subbreed][subsubbreed]/1000
              }
              else
              {
                result[breed + "(бесподстилочный)"] = unlineddiff * data.Головы.бесподстилочный[breed][subbreed][subsubbreed] * productionData[breed][subbreed][subsubbreed]/1000
            }
            }
          }
          else
          {
            if(result[breed + "(бесподстилочный)"])
            {
              result[breed + "(бесподстилочный)"] += unlineddiff * data.Головы.бесподстилочный[breed][subbreed] * productionData[breed][subbreed]/1000
            }
            else
            {
              result[breed + "(бесподстилочный)"] = unlineddiff * data.Головы.бесподстилочный[breed][subbreed] * productionData[breed][subbreed]/1000
            }
          }
        }
      }
    console.log(result)

    let fancyresult = {}

    for (const breed in result)
    {
      if(!fancyresult[fancynames[breed]])
      {
        fancyresult[fancynames[breed]] = result[breed]
      }
      else
      {
        fancyresult[fancynames[breed]] += result[breed]
      }
    }
    let returnresult = {}
    if (fancyresult)
    {
      console.log(fancyresult)
    
    for (const key in fancyresult)
    {
      if (key.split('(')[1] == "подстилочный)")
      {
        if (data.Остатки.подстилочный[unfancynames[key]])
        {
          returnresult[key] =   Math.ceil(fancyresult[key] + data.Остатки.подстилочный[unfancynames[key]]).toString() + ` (в том числе числе ${data.Остатки.подстилочный[unfancynames[key]]} накопленные ранее)`
        }
        else 
        {
          returnresult[key] = Math.ceil(fancyresult[key]).toString()
        }
      }
      else
      {
        if (data.Остатки.бесподстилочный[unfancynames[key]])
        {
          returnresult[key] =   Math.ceil(fancyresult[key] + data.Остатки.бесподстилочный[unfancynames[key]]).toString() + ` (в том числе числе ${data.Остатки.бесподстилочный[unfancynames[key]]} накопленные ранее)`
        }
        else 
        {
          returnresult[key] = Math.ceil(fancyresult[key]).toString()
        }
      }
    }}
    console.log(returnresult)
    return returnresult
  }
  }
}
