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

  return (
    // <Paper radius="md" p="xl" withBorder {...props}>
    //   <Text size="lg" fw={500}>
    //     Welcome to Mantine, {type} with
    //   </Text>

    //   <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {})}>
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
    // </Paper>
  );
}
