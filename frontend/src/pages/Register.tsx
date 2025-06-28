/**
 * Página de Registro
 * Permite que novos usuários se registrem no sistema
 */

import { ErrorMessage, Field, Formik } from 'formik'
import { Button } from 'primereact/button' 
import   { useRef } from 'react' 
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useRegisterUserMutation } from '../provider/queries/Auth.query'
import { toast } from 'sonner'
import ReCAPTCHA from 'react-google-recaptcha'

const Register = () => {

  const [registerUser,registerUserResponse] = useRegisterUserMutation()

  const navigate  = useNavigate()
  
  // Referência para o componente reCAPTCHA
  //@ts-ignore
  const RecaptchaRef = useRef<any>();

  // Interface para os dados do formulário de registro
  type User = {
    token:string;
    name: string,
    email: string,
    password: string
  }

  // Valores iniciais do formulário
  const initialValues: User = {
    name: '',
    token:'',
    email: '',
    password: ''
  }

  // Schema de validação usando Yup
  const validationSchema = yup.object({
    name: yup.string().required("Nome é obrigatório"),
    email: yup.string().email("Email deve ser válido").required("Email é obrigatório"),
    password: yup.string().min(5, "Senha deve ter mais de 5 caracteres").required("Senha é obrigatória"),
  })

  /**
   * Manipula o envio do formulário de registro
   * @param {User} e - Dados do formulário
   * @param {Object} resetForm - Função para resetar o formulário
   */
  const OnSubmitHandler = async (e: User, { resetForm }: any) => {
        try {
          const {data,error }:any = await registerUser(e)
       
          
              if(error){
                toast.error(error.data.message);
                return
                
              }

              console.log(data,error);

              // Armazena o token de autenticação no localStorage
              localStorage.setItem("token",data.token);

              

          resetForm()
          navigate("/")
        } catch (error:any) {
          toast.error(error.message);
              
          }finally{
          // Reseta o reCAPTCHA após o envio
          RecaptchaRef.current.reset();
          }
        
  }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-[#eee]'>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={OnSubmitHandler}>
        {({ values, setFieldValue, handleSubmit }) => (
          <>
            <form onSubmit={handleSubmit} className="w-[96%] md:w-[70%] lg:w-1/3 shadow-md rounded-md pt-10 pb-3 px-4 bg-white">
            
              <div className="mb-3 py-1">
                <label htmlFor="name">Nome</label>
                <Field id='name' name='name' className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg' placeholder='Digite seu nome completo' />
                <ErrorMessage component={'p'} className='text-red-500 text-sm ' name='name' />
              </div>
              <div className="mb-3 py-1">
                <label htmlFor="email">Email</label>
                <Field id='email' name='email' className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg' placeholder='Digite seu endereço de email' />
                <ErrorMessage component={'p'} className='text-red-500 text-sm ' name='email' />
              </div>
              <div className="mb-3 py-1">
                <label htmlFor="password">Senha</label>

                <Field name='password' id='password' className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg' placeholder='*****' />
                <ErrorMessage component={'p'} className='text-red-500 text-sm ' name='password' />

              </div>
              <div className="mb-3 py-1">
                <ReCAPTCHA
                  ref={RecaptchaRef}
                  sitekey={import.meta.env.VITE_SITE_KEY}
                  onChange={(e) => { setFieldValue('token', e) }}
                />
              </div>
              <div className="mb-3 py-1">
                <Button disabled={!values.token} loading={registerUserResponse.isLoading} raised type='submit'   className='w-full bg-red-500 text-white py-3 px-2 flex items-center justify-center'>Registrar

                </Button>
              </div>
              <div className="mb-3 py-1 flex items-center justify-end">
                <p className="inline-flex items-center gap-x-1">   Já tem uma conta?<Link className='font-semibold' to={'/login'}>Entrar</Link></p>
              </div>
              
            </form>
          </>
        )}
      </Formik>
    </div>
  )
}

export default Register