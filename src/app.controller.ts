import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpException,
  ParseFloatPipe,
  ParseBoolPipe,
  ParseArrayPipe,
  ParseEnumPipe,
  ParseUUIDPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Ggg } from './enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 通过http://localhost:3000/?aa=333访问
  @Get()
  getHello(
    @Query(
      'aa',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
      }),
    )
    aa: string,
  ): string {
    return aa + 1;
  }

  // 还可以自己抛一个异常出来  然后让exception filter处理
  // 通过http://localhost:3000/bb?bb=333访问
  @Get('bb')
  bb(
    @Query(
      'bb',
      new ParseIntPipe({
        exceptionFactory: (msg) => {
          console.log(msg);
          throw new HttpException('xxx' + msg, HttpStatus.NOT_IMPLEMENTED);
        },
      }),
    )
    bb: string,
  ): string {
    return bb + 1;
  }

  @Get('cc')
  cc(@Query('cc', ParseFloatPipe) cc: number) {
    return cc + 1;
  }

  @Get('dd')
  dd(@Query('dd', ParseBoolPipe) dd: boolean) {
    return typeof dd;
  }

  // http://localhost:3000/ee?ee=1,2,3,4
  @Get('ee')
  ee(
    @Query(
      'ee',
      new ParseArrayPipe({
        items: Number,
      }),
    )
    ee: Array<number>,
  ) {
    return ee.reduce((total, item) => total + item, 0);
  }

  // http://localhost:3000/gg/111 如果参数值不是枚举里的 就会报错
  @Get('gg/:enum')
  gg(@Param('enum', new ParseEnumPipe(Ggg)) e: Ggg) {
    return e;
  }

  // http://localhost:3000/hh/015683cd-d2a4-4afa-9227-a74812fbdf5c
  @Get('hh/:uuid')
  hh(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return uuid;
  }

  // http://localhost:3000/kkk?kkk=222 输出222
  // http://localhost:3000/kkk  输出默认值aaa
  @Get('kkk')
  kkk(@Query('kkk', new DefaultValuePipe('aaa')) kkk: string) {
    return kkk;
  }
}
