import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link } from 'react-router-dom';
import { Container, Content, Background } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/Auth';
import LogoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/Toats';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const HandleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        await signIn({
          email: data.email,
          password: data.password,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        }
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
        });
      }
    },
    [signIn, addToast],
  );
  return (
    <Container>
      <Content>
        <img src={LogoImg} alt="Gobarber" />

        <Form ref={formRef} onSubmit={HandleSubmit}>
          <h1>Entrar</h1>

          <Input name="email" placeholder="E-mail" icon={FiMail} />
          <Input
            name="password"
            placeholder="Senha"
            icon={FiLock}
            type="password"
          />
          <Button type="submit">Entrar</Button>
          <Link to="/forgot-password">Esqueci minha senha</Link>
        </Form>
        <Link to="/signup">
          <FiLogIn size="20" />
          Criar Conta
        </Link>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
