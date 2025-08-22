import { api as axios } from "./config"; // твой базовый инстанс (BASE=/api)

export type MembershipRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export interface InvitationCreate {
  invited_email: string;
  role: MembershipRole;
  department_id?: string | null;
  expires_at?: string | null; // ISO
}

export interface InvitationRead {
  id: string;
  org_id: string;
  invited_email: string;
  role: MembershipRole;
  department_id?: string | null;
  token: string;
  expires_at?: string | null;
  invited_by_id?: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  created_at: string;
  updated_at: string;
}

export interface InvitationPreflight {
  org_id: string;
  invited_email: string;
  role: MembershipRole;
  department_id?: string | null;
  expires_at?: string | null;
  status: string;
  organization_name?: string | null;
}

export const InvitationsAPI = {
  create(orgId: string, payload: InvitationCreate) {
    return axios.post<InvitationRead>(`/orgs/${orgId}/invitations`, payload).then(r => r.data);
  },
  preflight(token: string) {
    // путь зависит от префикса в бэке: сейчас /api/orgs/invitations/{token}
    return axios.get<InvitationPreflight>(`/orgs/invitations/${token}`).then(r => r.data);
  },
  accept(token: string) {
    return axios.post<InvitationRead>(`/orgs/invitations/${token}/accept`, {}).then(r => r.data);
  },
  reject(token: string) {
    return axios.post<InvitationRead>(`/orgs/invitations/${token}/reject`, {}).then(r => r.data);
  },
};