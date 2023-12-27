'use client';

import { Container, TextInput, Textarea, SimpleGrid, Group, Title, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';
import { useRouter } from 'next/navigation';
import classes from './contact.module.css';

type FormValues = {
  name: string;
  email: string;
  message: string;
};

const Contact = () => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? '名前は2文字以上で入力してください' : null),
      email: (value) => (!/^\S+@\S+$/.test(value) ? '有効なメールアドレスを入力してください' : null),
      message: (value) => (value.trim().length === 0 ? 'メッセージを入力してください' : null),
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log(values);
    registerUser(values);
  };

  // フォーム送信時の処理
  const registerUser = async (values: FormValues) => {
  const res = await fetch('/api/send', {
  body: JSON.stringify(values),
  headers: {
    Accept: "application/json", 
    'Content-Type': 'application/json'
  },
  method: 'POST'
  });

  const result = await res.json();
    if (res.status === 200) {
      // リダイレクト先のページへ
      router.push("/");
      alert("送信が完了しました！");
    } else {
      alert("正常に送信できませんでした");
    }
  };

  return (
    <>
      <Container size={700} className={classes.wrapper}>
      <form onSubmit={form.onSubmit((values) => {handleSubmit(values);})}>
          <Title order={2} size="h3" fw={900} ta="center">
            お問い合わせ
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
            <TextInput
              label="お名前"
              placeholder="Your name"
              {...form.getInputProps('name')}
            />
            <TextInput
              label="メールアドレス"
              placeholder="Your email"
              {...form.getInputProps('email')}
            />
          </SimpleGrid>

          <Textarea
            mt="md"
            label="お問い合わせ内容"
            placeholder="Your message"
            maxRows={10}
            minRows={5}
            autosize
            {...form.getInputProps('message')}
          />

          <Group justify="center" mt="xl">
            <Button type="submit" size="md">
              Send message
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
}

export default Contact;