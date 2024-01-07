import cx from 'clsx';
import { useState } from 'react';
import {
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import {
  IconLogout,
  IconChevronDown,
} from '@tabler/icons-react';
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './HeaderIcon.module.css';
import { useAuth } from './AuthContext';

const tabs = [
  'Home',
  'Orders',
  'Education',
  'Community',
  'Forums',
  'Support',
  'Account',
  'Helpdesk',
];

export function HeaderIcon() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { auth, logout } = useAuth();
  const currentUser = auth.user;
  const router = useRouter();

  const user = {
    name: currentUser.name,
    image: 'icon-user.png',
  };

  const goToMyPage = () => {
    router.push(`/my-page`);
  };

  const handleLogout = () => {
    logout(); // ローカルの認証状態をクリア
  };

  return (
    <Group justify="space-between">
      <Menu
        width={260}
        position="bottom-end"
        transitionProps={{ transition: 'pop-top-right' }}
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton
            className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
          >
            <Group gap={3} justify="center">
              <Avatar src={user.image} alt={user.name} radius="xl" size={30} />
              <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>
            <Text fw={500} size="sm" lh={2} mr={3} onClick={goToMyPage}>
              {currentUser.data.attributes.name}
            </Text>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            leftSection={
              <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            }
            onClick={handleLogout}
          >
            ログアウト
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}