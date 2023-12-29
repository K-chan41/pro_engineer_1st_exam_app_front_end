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
      name: (val) => (val.trim().length < 2 ? '名前は2文字以上で入力してください' : null),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : '有効なメールアドレスを入力してください'),
      password: (val) => (val.length <= 6 ? 'パスワードには少なくとも6文字を含める必要があります' : null),
    },
  });

  const { auth, login } = useAuth();
  const currentUser = auth.user;

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/registration', {
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
        const data = await response.json();
        const user = data.data.attributes;
        const token = response.headers.get('AccessToken');
        login(token, user);
        console.log('登録成功！');
        console.log(token, user);
        notifications.show({
          title: '注意',
          message: '少なくとも一つの年度を選択してください。',
          color: 'red',
        })
      } else {
        // エラー処理
        console.error('登録失敗');
      }
    } catch (error) {
      console.error('エラーが発生しました', error);
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
            label="メールアドレス"
            placeholder="Your email"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && '有効なメールアドレスを入力してください'}
            radius="md"
          />

          <PasswordInput
            required
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
