'use client';

import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  // Text,
  // Paper,
  Group,
  PaperProps,
  Button,
  // Divider,
  Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';
import { useAuth } from './AuthContext';
import { notifications } from '@mantine/notifications';

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      name: (val) => type === 'register' && (val.trim().length < 2 ? '名前は2文字以上で入力してください' : null),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : '有効なメールアドレスを入力してください'),
      password: (val) => (val.length < 6 ? 'パスワードには少なくとも6文字を含める必要があります' : null),
    },
  });

  const { auth, login } = useAuth();
  const currentUser = auth.user;

  const handleSubmit = async (values: FormValues) => {
    const endpoint = type === 'register' ? '/api/v1/registration' : '/api/v1/authentication';
    try {
      const response = await fetch(`https://pro-engineer-1st-exam-app-api-d4afe40512f5.herokuapp.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            name: values.name,
            email: values.email,
            password: values.password,
          }
        })
      });

      if (response.ok) {
        // 登録成功時の処理
        const user = await response.json();
        const token = response.headers.get('AccessToken');

        if (token) {
          login(token, user);
          notifications.show({
            title: '成功！',
            message: 'ログインできました'
          });
        }
      } else {
        const error = await response.json();
        notifications.show({
          title: '失敗',
          message: error.error || 'ログインできませんでした',
          color: 'red'
        });
      }
    } catch (error) {
      console.error('エラーが発生しました', error);
      notifications.show({
        title: 'エラー',
        message: '通信エラーが発生しました',
        color: 'red',
      });
    }
  };

  return (
  <>
    <div>
      {currentUser ? (
        <p>ようこそ、{currentUser.name}さん</p>
      ) : (
        <p>ゲストユーザーとしてアクセスしています。</p>
      )}
    </div>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === 'register' && (
            <TextInput
              required
              size="md"
              label="名前"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              error={form.errors.name && '名前は2文字以上で入力してください'}
              radius="md"
            />
          )}

          <TextInput
            required
            size="md"
            label="メールアドレス"
            placeholder="Your email"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && '有効なメールアドレスを入力してください'}
            radius="md"
          />

          <PasswordInput
            required
            size="md"
            label="パスワード"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'パスワードには少なくとも6文字を含める必要があります'}
            radius="md"
          />

          {type === 'register' && (
            <Checkbox
              label="利用規約とプライバシーポリシーに同意します"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'すでにアカウント登録済み | ログイン'
              : "アカウントを登録していない | 新規登録"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </>
  );
}
