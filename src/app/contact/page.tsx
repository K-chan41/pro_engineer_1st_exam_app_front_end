'use client';

import { TextInput, Textarea, SimpleGrid, Group, Title, Button } from '@mantine/core';
import { useForm } from '@mantine/form';

import React from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import * as yup from 'yup'
// import { yupResolver } from '@hookform/resolvers/yup'
// import { useRouter } from "next/router";

// フォームの型
type ContactForm = {
  name: string
  email: string
  message: string
};

export default function Contact() {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !/^\S+@\S+$/.test(value),
      subject: (value) => value.trim().length === 0,
    },
  });

  // フォーム送信時の処理（バリデーションOKな時に実行される）
  const registerUser = async event => {
    event.preventDefault()

    const res = await fetch('/api/send', {
      body: JSON.stringify({
        email: event.target.email.value,
        message: event.target.message.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const result = await res.json()
    if (response.status === 200) {
      router.push("/thanks");
    } else {
      alert("正常に送信できませんでした");
    };
  }

  return (
    <>
      <form onSubmit={registerUser}>
        <Title
          order={2}
          size="h1"
          style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)' }}
          fw={900}
          ta="center"
        >
          Get in touch
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
          <TextInput
            label="お名前"
            placeholder="お名前"
            name="name"
            variant="filled"
            {...register('name')}
            error={'name' in errors}
            helperText={errors.name?.message}
          />
          <TextInput
            label="Email"
            placeholder="Your email"
            name="email"
            variant="filled"
            {...register('email')}
            error={'email' in errors}
            helperText={errors.email?.message}
          />
        </SimpleGrid>

        <Textarea
          mt="md"
          label="Message"
          placeholder="Your message"
          maxRows={10}
          minRows={5}
          autosize
          name="message"
          variant="filled"
          {...register('message')}
          error={'message' in errors}
          helperText={errors.message?.message}
        />

        <Group justify="center" mt="xl">
          <Button type="submit" size="md">
            Send message
          </Button>
        </Group>
      </form>
    </>
  )
};