/**
 * Página de Login
 * Permite que usuários autentiquem no sistema usando email, senha e reCAPTCHA
 */

import { ErrorMessage, Field, Formik } from "formik";
import { Button } from "primereact/button";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useLoginUserMutation } from "../provider/queries/Auth.query";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [LoginUser, LoginUserResponse] = useLoginUserMutation();
  const navigate = useNavigate();
  
  // Interface para os dados do formulário de login
  type User = {
    token: string;
    email: string;
    password: string;
  };

  // Referência para o componente reCAPTCHA
  //@ts-ignore
  const RecaptchaRef = useRef<any>();

  // Valores iniciais do formulário
  const initialValues: User = {
    token: "",
    email: "",
    password: "",
  };

  // Schema de validação usando Yup
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Email deve ser válido")
      .required("Email é obrigatório"),
    password: yup
      .string()
      .min(5, "Senha deve ter mais de 5 caracteres")
      .required("Senha é obrigatória"),
  });

  /**
   * Manipula o envio do formulário de login
   * @param {User} e - Dados do formulário
   * @param {Object} resetForm - Função para resetar o formulário
   */
  const OnSubmitHandler = async (e: User, { resetForm }: any) => {
    try {
      const { data, error }: any = await LoginUser(e);
      if (error) {
        toast.error(error.data.message);
        return;
      }

      // Armazena o token de autenticação no localStorage
      localStorage.setItem("token", data.token);

      resetForm();
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      // Reseta o reCAPTCHA após o envio
      RecaptchaRef.current.reset();
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center w-full bg-[#eee]">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={OnSubmitHandler}
        >
          {({ values, setFieldValue, handleSubmit }) => (
            <>
              <form
                onSubmit={handleSubmit}
                className="w-[96%] md:w-[70%] lg:w-1/3 shadow-md rounded-md pt-10 pb-3 px-4 bg-white"
              >
                <div className="mb-3 py-1">
                  <label htmlFor="email">Email</label>
                  <Field
                    id="email"
                    name="email"
                    className="w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg"
                    placeholder="Digite seu endereço de email"
                  />
                  <ErrorMessage
                    component={"p"}
                    className="text-red-500 text-sm "
                    name="email"
                  />
                </div>
                <div className="mb-3 py-1">
                  <label htmlFor="password">Senha</label>

                  <Field
                    name="password"
                    id="password"
                    className="w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg"
                    placeholder="*****"
                  />
                  <ErrorMessage
                    component={"p"}
                    className="text-red-500 text-sm "
                    name="password"
                  />
                </div>
                <div className="mb-3 py-1">
                  <ReCAPTCHA
                    ref={RecaptchaRef}
                    sitekey={import.meta.env.VITE_SITE_KEY}
                    onChange={(e) => {
                      setFieldValue("token", e);
                    }}
                  />
                </div>
                <div className="mb-3 py-1 flex items-center justify-center">
                  <Button
                    type="submit"
                    disabled={!values.token}
                    loading={LoginUserResponse.isLoading}
                    className="w-full bg-red-500 text-white py-3 px-2 flex items-center justify-center"
                  >
                    Entrar
                  </Button>
                </div>
                <div className="mb-3 py-1 flex items-center justify-end">
                  <p className="inline-flex items-center gap-x-1">
                    {" "}
                    Não tem uma conta?
                    <Link className="font-semibold" to={"/register"}>
                      Registrar
                    </Link>
                  </p>
                </div>
                <div className="mb-3 py-1 flex items-center justify-end">
                  <p className="inline-flex items-center gap-x-1">
                    {" "}
                    Esqueceu a
                    <Link className="font-semibold" to={"#"}>
                      senha?
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Login;
