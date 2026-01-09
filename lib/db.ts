
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Ensure users file exists
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Optional/hashed
    role: 'USER' | 'ADMIN';
    createdAt: string;
}

function readUsers(): User[] {
    try {
        const data = fs.readFileSync(usersFile, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeUsers(users: User[]) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

export const db = {
    user: {
        findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
            const users = readUsers();
            if (where.email) {
                return users.find((u) => u.email === where.email) || null;
            }
            if (where.id) {
                return users.find((u) => u.id === where.id) || null;
            }
            return null;
        },
        create: async ({ data }: { data: Omit<User, 'id' | 'createdAt'> }) => {
            const users = readUsers();
            const newUser: User = {
                id: Math.random().toString(36).substring(2, 15),
                ...data,
                createdAt: new Date().toISOString(),
            };
            users.push(newUser);
            writeUsers(users);
            return newUser;
        },
        findMany: async () => {
            return readUsers();
        }
    },
};
