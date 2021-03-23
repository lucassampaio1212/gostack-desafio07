import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, Background } from './styles';
import LogoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/Toats';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { addToast } = useToast();

  const HandleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('digite um e-mail válido'),
          password: Yup.string().min(6, 'No minimo 6 digitos'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        await api.post('/users', data);
        history.push('/');
        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Você já pode fazer seu logon no GoBarber!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [addToast, history],
  );
  return (
    <Container>
      <Background />
      <Content>
        <Link to="/">
          <img src={LogoImg} alt="Gobarber" />
        </Link>

        <Form ref={formRef} onSubmit={HandleSubmit}>
          <h1>Faça seu cadastro</h1>

          <Input name="name" placeholder="Nome" icon={FiUser} />
          <Input name="email" placeholder="E-mail" icon={FiMail} />
          <Input
            name="password"
            placeholder="Senha"
            icon={FiLock}
            type="password"
          />
          <Button type="submit">Cadastrar</Button>
        </Form>
        <Link to="/">
          <FiArrowLeft size="20" />
          Voltar para o Logon
        </Link>
      </Content>
    </Container>
  );
};

export default SignUp;
