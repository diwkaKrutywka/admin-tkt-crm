export interface Ticket {
    id: string;
    status: 'new' | 'in_progress' | 'closed' | string;
    source: 'incoming_call' | 'web' | 'email' | string;
    initiator: string;
    contact?: {
      [key: string]: any;
    };
    appeal?: {
      [key: string]: any;
    };
    complaint?: Complaint;
    comments?: Comment[];
    change_history?: ChangeHistory[];
  }


  export interface Complaint {
    id: string;
    status: 'new' | 'in_progress' | 'resolved' | string;
    created_at: string;
    updated_at: string;
    appeal?: any;
    organization?: any;
    assignee?: any;
  }
  

  export interface Comment {
    created_at: string;
    updated_at: string;
    content: string;
    author?: {
      [key: string]: any;
    };
  }
  

  export interface ChangeHistory {
    id: string;
    change_type: 'created' | 'updated' | 'deleted' | string;
    description: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
  }
  