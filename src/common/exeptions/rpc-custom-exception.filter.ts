
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost){

    const ctx=host.switchToHttp()
    const resposne = ctx.getResponse()

    const rpcError =  exception.getError()


    if(rpcError.toString().includes('Empty response')){
      return resposne.status(500).json({
        status:500,
        message:rpcError.toString().substring(0,rpcError.toString().indexOf('(')-1)
      })
    }


    if(typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError ){
      const errorObject = rpcError as { status: any; message: string };
      const status = isNaN(+errorObject.status) ? 400 : errorObject.status
      return resposne.status(status).json(rpcError)
    }
    console.log({rpcError})

    resposne.status(400).json({
      status:400,
      message:rpcError
    })
  }
}
