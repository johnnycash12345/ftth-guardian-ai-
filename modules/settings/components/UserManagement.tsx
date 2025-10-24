import React, { useContext } from 'react';
import { AppContext } from '../../../App';
import { Card } from '../../../components/common/Card';
import { Table } from '../../../components/common/Table';
import { Button } from '../../../components/common/Button';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '../../../constants';
import type { User, Role } from '../../../types';

const roleColors: Record<Role, string> = {
    Admin: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    Operator: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Executive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Guest: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
}

export const UserManagement: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;
  
  const { users, setUsers } = context;

  const columns: { key: keyof User; header: string; render?: (item: User) => React.ReactNode }[] = [
      { key: 'name', header: 'Nome'},
      { key: 'email', header: 'Email'},
      { key: 'role', header: 'Perfil', render: (item) => (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[item.role]}`}>
              {item.role}
          </span>
      )},
      { key: 'lastLogin', header: 'Último Login', render: (item) => new Date(item.lastLogin).toLocaleString()},
  ];

  return (
    <Card title="Gerenciamento de Usuários (RBAC)" actions={<Button variant="secondary"><PlusCircleIcon className="w-5 h-5 mr-2" />Adicionar Usuário</Button>}>
        <Table<User>
            columns={columns}
            data={users}
            renderActions={(item) => (
                <div className="flex space-x-2 justify-end">
                    <button className="text-primary-500 hover:text-primary-700"><PencilIcon /></button>
                    <button className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                </div>
            )}
        />
    </Card>
  );
};
