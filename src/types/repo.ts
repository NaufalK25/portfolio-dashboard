import { allowedStacks } from '../utils/constants';
import { GHRepoOwnerType } from './gh-repo';

export type Repo = {
  id: number;
  createdAt: string;
  updatedAt: string;
  ghId: string;
  name: string;
  owner: string;
  type: RepoType;
  homepage: string;
  htmlUrl: string;
  licenseName: string;
  licenseUrl: string;
  thumbnail: string;
  description: string;
  created_at: string;
  stacks: RepoStack | RepoStack[];
};

export type RepoStack = (typeof allowedStacks)[number];

export type RepoName = {
  id: number;
  createdAt: string;
  updatedAt: string;
  ghId: string;
  name: string;
  owner: string;
  type: RepoType;
};

export type RepoType = GHRepoOwnerType;
