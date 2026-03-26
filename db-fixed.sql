--
-- PostgreSQL database dump
--

-- \restrict 2MPhV6iH8hlfjdjAMLMpMEA0jdLqBhhWoRYfWXVTN0mMRrVPupvtZKPsNTFX2Gv

-- Dumped from database version 17.8 (a284a84)
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: activity_action; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.activity_action AS ENUM (
    'created',
    'updated',
    'deleted',
    'status_changed',
    'assigned',
    'completed',
    'commented'
);


ALTER TYPE public.activity_action OWNER TO postgres;

--
-- Name: budget_item_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.budget_item_status AS ENUM (
    'pending',
    'contracted',
    'paid'
);


ALTER TYPE public.budget_item_status OWNER TO postgres;

--
-- Name: campaign_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.campaign_status AS ENUM (
    'draft',
    'approved',
    'active',
    'completed'
);


ALTER TYPE public.campaign_status OWNER TO postgres;

--
-- Name: campaign_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.campaign_type AS ENUM (
    'product_launch',
    'seasonal_promotion',
    'brand_engagement',
    'corporate_event',
    'awareness'
);


ALTER TYPE public.campaign_type OWNER TO postgres;

--
-- Name: dependency_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.dependency_type AS ENUM (
    'finish_to_start',
    'start_to_start',
    'finish_to_finish',
    'start_to_finish'
);


ALTER TYPE public.dependency_type OWNER TO postgres;

--
-- Name: employment_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.employment_type AS ENUM (
    'clt',
    'hourly_contractor',
    'contract_service'
);


ALTER TYPE public.employment_type OWNER TO postgres;

--
-- Name: execution_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.execution_status AS ENUM (
    'in_progress',
    'completed',
    'paused'
);


ALTER TYPE public.execution_status OWNER TO postgres;

--
-- Name: initiative_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.initiative_status AS ENUM (
    'solicitada',
    'aprovada',
    'recusada',
    'em_andamento',
    'concluida'
);


ALTER TYPE public.initiative_status OWNER TO postgres;

--
-- Name: planning_base_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.planning_base_type AS ENUM (
    'annual',
    'quarterly',
    'custom'
);


ALTER TYPE public.planning_base_type OWNER TO postgres;

--
-- Name: project_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.project_category AS ENUM (
    'implementation',
    'operational',
    'event',
    'travel',
    'infrastructure',
    'strategic',
    'maintenance',
    'custom'
);


ALTER TYPE public.project_category OWNER TO postgres;

--
-- Name: project_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.project_status AS ENUM (
    'active',
    'paused',
    'completed',
    'cancelled'
);


ALTER TYPE public.project_status OWNER TO postgres;

--
-- Name: sector_member_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.sector_member_role AS ENUM (
    'responsavel',
    'agente'
);


ALTER TYPE public.sector_member_role OWNER TO postgres;

--
-- Name: stage_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.stage_status AS ENUM (
    'pending',
    'in_progress',
    'completed'
);


ALTER TYPE public.stage_status OWNER TO postgres;

--
-- Name: task_action_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_action_status AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'rejected'
);


ALTER TYPE public.task_action_status OWNER TO postgres;

--
-- Name: task_action_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_action_type AS ENUM (
    'sign_document',
    'make_payment',
    'confirm_completion',
    'review',
    'approve',
    'custom'
);


ALTER TYPE public.task_action_type OWNER TO postgres;

--
-- Name: task_participant_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_participant_role AS ENUM (
    'owner',
    'assignee',
    'reviewer',
    'observer'
);


ALTER TYPE public.task_participant_role OWNER TO postgres;

--
-- Name: task_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_priority AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);


ALTER TYPE public.task_priority OWNER TO postgres;

--
-- Name: task_shift; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_shift AS ENUM (
    'morning',
    'afternoon',
    'night'
);


ALTER TYPE public.task_shift OWNER TO postgres;

--
-- Name: task_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_status AS ENUM (
    'open',
    'in_progress',
    'completed',
    'overdue',
    'blocked',
    'standby'
);


ALTER TYPE public.task_status OWNER TO postgres;

--
-- Name: team_member_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.team_member_status AS ENUM (
    'active',
    'pending_registration'
);


ALTER TYPE public.team_member_status OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    id text NOT NULL,
    entity_type text NOT NULL,
    entity_id text NOT NULL,
    project_id text,
    action public.activity_action NOT NULL,
    field_changed text,
    old_value text,
    new_value text,
    performed_by text,
    performed_at timestamp with time zone DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    company_name character varying(255) DEFAULT ''::character varying NOT NULL,
    contact_name character varying(255) DEFAULT ''::character varying,
    role character varying(255) DEFAULT ''::character varying,
    phone character varying(50) DEFAULT ''::character varying,
    email character varying(255) DEFAULT ''::character varying,
    website character varying(255) DEFAULT ''::character varying,
    address text DEFAULT ''::text,
    city character varying(255) DEFAULT ''::character varying,
    zip character varying(20) DEFAULT ''::character varying,
    primary_color character varying(7) DEFAULT '#666666'::character varying,
    secondary_color character varying(7) DEFAULT '#999999'::character varying,
    logo_bg_color character varying(7) DEFAULT '#ffffff'::character varying,
    logo_bg_opacity numeric(3,2) DEFAULT 1.00,
    logo_plus_color character varying(7) DEFAULT '#888888'::character varying,
    logo_plus_opacity numeric(3,2) DEFAULT 1.00,
    logo_ad_color character varying(7) DEFAULT '#444444'::character varying,
    logo_ad_opacity numeric(3,2) DEFAULT 1.00,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_id_seq OWNER TO postgres;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: budget_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_items (
    id character varying(21) NOT NULL,
    project_id character varying(21) NOT NULL,
    category character varying(100) NOT NULL,
    description text DEFAULT ''::text,
    vendor character varying(255) DEFAULT ''::character varying,
    predicted_amount numeric(12,2) DEFAULT 0,
    contracted_amount numeric(12,2) DEFAULT 0,
    paid_amount numeric(12,2) DEFAULT 0,
    status public.budget_item_status DEFAULT 'pending'::public.budget_item_status,
    due_date date,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.budget_items OWNER TO postgres;

--
-- Name: campaign_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaign_posts (
    id character varying(21) NOT NULL,
    campaign_id character varying(21) NOT NULL,
    title character varying(255) NOT NULL,
    content text DEFAULT ''::text,
    channel character varying(100) DEFAULT ''::character varying,
    scheduled_date date,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.campaign_posts OWNER TO postgres;

--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaigns (
    id character varying(21) NOT NULL,
    name character varying(255) NOT NULL,
    type public.campaign_type NOT NULL,
    duration integer DEFAULT 7 NOT NULL,
    channels text[] DEFAULT '{}'::text[],
    objective text DEFAULT ''::text,
    target_audience text DEFAULT ''::text,
    status public.campaign_status DEFAULT 'draft'::public.campaign_status,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.campaigns OWNER TO postgres;

--
-- Name: executions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.executions (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    task_action_id text NOT NULL,
    operator_id text NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    ended_at timestamp with time zone,
    duration_minutes integer,
    notes text,
    status public.execution_status DEFAULT 'in_progress'::public.execution_status NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.executions OWNER TO postgres;

--
-- Name: initiatives; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.initiatives (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    name text NOT NULL,
    description text,
    responsible_id text,
    status public.initiative_status DEFAULT 'solicitada'::public.initiative_status NOT NULL,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    sector_id text,
    assigned_team_id text,
    solicitante_id character varying(255),
    type text,
    context text
);


ALTER TABLE public.initiatives OWNER TO postgres;

--
-- Name: login_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_attempts (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    attempted_at timestamp with time zone DEFAULT now(),
    success boolean DEFAULT false NOT NULL
);


ALTER TABLE public.login_attempts OWNER TO postgres;

--
-- Name: login_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_attempts_id_seq OWNER TO postgres;

--
-- Name: login_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_attempts_id_seq OWNED BY public.login_attempts.id;


--
-- Name: module_stages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.module_stages (
    id text NOT NULL,
    module_id text NOT NULL,
    name text NOT NULL,
    description text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.module_stages OWNER TO postgres;

--
-- Name: module_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.module_tasks (
    id text NOT NULL,
    module_stage_id text NOT NULL,
    name text NOT NULL,
    description text,
    priority public.task_priority DEFAULT 'medium'::public.task_priority NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.module_tasks OWNER TO postgres;

--
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modules (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.modules OWNER TO postgres;

--
-- Name: planning_base_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planning_base_items (
    id text NOT NULL,
    planning_base_id text NOT NULL,
    name text NOT NULL,
    description text,
    project_idea text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.planning_base_items OWNER TO postgres;

--
-- Name: planning_bases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planning_bases (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    type public.planning_base_type DEFAULT 'custom'::public.planning_base_type NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.planning_bases OWNER TO postgres;

--
-- Name: project_checklist_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_checklist_items (
    id text NOT NULL,
    project_id text NOT NULL,
    title text NOT NULL,
    description text,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp with time zone,
    completed_by text,
    sort_order integer DEFAULT 0 NOT NULL,
    category_key text DEFAULT 'geral'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.project_checklist_items OWNER TO postgres;

--
-- Name: project_stages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_stages (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    project_id text NOT NULL,
    name text NOT NULL,
    description text,
    sort_order integer DEFAULT 0 NOT NULL,
    status public.stage_status DEFAULT 'pending'::public.stage_status NOT NULL,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    assigned_team_id text
);


ALTER TABLE public.project_stages OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id character varying(21) NOT NULL,
    name character varying(255) NOT NULL,
    description text DEFAULT ''::text,
    start_date date NOT NULL,
    end_date date,
    budget numeric(12,2) DEFAULT 0,
    status public.project_status DEFAULT 'active'::public.project_status,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    category public.project_category DEFAULT 'custom'::public.project_category,
    owner_id text,
    priority public.task_priority DEFAULT 'medium'::public.task_priority,
    tags text[] DEFAULT '{}'::text[],
    initiative_id text NOT NULL,
    assigned_team_id text
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: sector_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sector_members (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    sector_id text NOT NULL,
    member_id text NOT NULL,
    role public.sector_member_role DEFAULT 'agente'::public.sector_member_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    permissions jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE public.sector_members OWNER TO postgres;

--
-- Name: sectors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sectors (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.sectors OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_accessed timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: task_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_actions (
    id text NOT NULL,
    task_id text NOT NULL,
    type public.task_action_type DEFAULT 'custom'::public.task_action_type NOT NULL,
    title text NOT NULL,
    description text,
    requested_by text,
    assigned_to text,
    status public.task_action_status DEFAULT 'pending'::public.task_action_status NOT NULL,
    due_date timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    operator_id text,
    estimated_hours numeric,
    actual_hours numeric
);


ALTER TABLE public.task_actions OWNER TO postgres;

--
-- Name: task_checklist_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_checklist_items (
    id text NOT NULL,
    task_id text NOT NULL,
    category_key text DEFAULT 'general'::text NOT NULL,
    title text NOT NULL,
    description text,
    is_completed boolean DEFAULT false NOT NULL,
    completed_by text,
    completed_at timestamp with time zone,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.task_checklist_items OWNER TO postgres;

--
-- Name: task_dependencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_dependencies (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    task_id text NOT NULL,
    depends_on_task_id text NOT NULL,
    dependency_type public.dependency_type DEFAULT 'finish_to_start'::public.dependency_type NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT no_self_dependency CHECK ((task_id <> depends_on_task_id))
);


ALTER TABLE public.task_dependencies OWNER TO postgres;

--
-- Name: task_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_participants (
    id text NOT NULL,
    task_id text NOT NULL,
    member_id text NOT NULL,
    role public.task_participant_role DEFAULT 'assignee'::public.task_participant_role NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.task_participants OWNER TO postgres;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id character varying(21) NOT NULL,
    project_id character varying(21) NOT NULL,
    assignee_id character varying(21),
    name character varying(255) NOT NULL,
    status public.task_status DEFAULT 'open'::public.task_status,
    priority public.task_priority DEFAULT 'medium'::public.task_priority,
    start_date date,
    end_date date,
    progress integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    stage_id text NOT NULL,
    assigned_team_id text,
    shift public.task_shift DEFAULT 'morning'::public.task_shift,
    CONSTRAINT tasks_progress_check CHECK (((progress >= 0) AND (progress <= 100)))
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: team_group_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_group_members (
    id text NOT NULL,
    team_id text NOT NULL,
    member_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.team_group_members OWNER TO postgres;

--
-- Name: team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_members (
    id character varying(21) NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(100) DEFAULT ''::character varying,
    initials character varying(4) DEFAULT ''::character varying,
    capacity_hours numeric(5,1) DEFAULT 40.0,
    created_at timestamp with time zone DEFAULT now(),
    user_id integer,
    email character varying(255),
    status public.team_member_status DEFAULT 'active'::public.team_member_status NOT NULL,
    employment_type public.employment_type DEFAULT 'clt'::public.employment_type NOT NULL,
    full_name character varying,
    nickname character varying,
    phone character varying
);


ALTER TABLE public.team_members OWNER TO postgres;

--
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id text NOT NULL,
    name text NOT NULL,
    sector_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- Name: user_passwords; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_passwords (
    user_id integer NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_passwords OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    display_name character varying(255) NOT NULL,
    avatar_url text,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: login_attempts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_attempts ALTER COLUMN id SET DEFAULT nextval('public.login_attempts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, entity_type, entity_id, project_id, action, field_changed, old_value, new_value, performed_by, performed_at, metadata) FROM stdin;
FplWTTTvhEk0gzVVtVLRN	projectStage	YNQV01NFrAViXGDaY5Umb	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 16:13:53.699+00	{}
R86a2M8LbYqSvE9tXBc3x	task	KiLzqbWREKNTUfqoLq2nC	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Thu Mar 05 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Mon Mar 02 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 17:34:57.951+00	\N
4NhA9xmwL9rjiJ9YWlc1x	task	KiLzqbWREKNTUfqoLq2nC	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Sun Mar 08 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Mar 05 2026 23:59:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 17:34:57.952+00	\N
2vJ9yy63QYlk3tIBcuDrJ	initiative	8wy3J87Zq0f_WxhQ28f-I	\N	created	\N	\N	\N	\N	2026-03-21 02:16:21.112+00	{}
vXdaS1UNSxx0K0LtJ0y_W	project	BNj9FcMOiVxgeHmgOxdlR	\N	created	\N	\N	\N	\N	2026-03-21 03:34:57.929+00	{}
uBwflYivAtYEPwDex_uHD	projectStage	Cm1ZmiCoBpg9DQHqvJa6L	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:57.953+00	{}
IYf8bm_9nSZF6GXX2tR_P	projectStage	2DCYm_a1sJQm6vsPxVoZ3	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:57.974+00	{}
zbdLqi1C9d6QeIlxSrwni	projectStage	-E7SkmN5mgoj4sglsp1fV	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:57.994+00	{}
W2W9PlcIIh-5HXLnU22Rh	projectStage	tA28PIpfJLJnW_oL9xZq1	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.016+00	{}
FA9NWxurbxXZBUpBCm85Y	projectStage	24mw0h3Yj8B1TR27gu_VW	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.037+00	{}
gRaTBX4kka1WKOjLk_gGt	projectStage	kzg95BTaXD7xpvf0N9xYs	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.057+00	{}
Us20HOdE0dx0SIysW8eW3	projectStage	cdg-nL7vJcsv9M9lY8yWt	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.078+00	{}
yTcAel0CEMb1vBJWj_GlK	task	cWwWNnkryvOPCFvVs2_n7	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.109+00	{}
R4vL3snMB_PEXiH40CE7t	task	ij9f3J7Zf4lekHu76FS3u	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.142+00	{}
23oYIPCy4P8L8IRBmEY4z	task	KtZUqytyfFUuzmsmUJpzV	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.169+00	{}
OK2KcWTfj3aK33Vlg23US	task	dY4_urTLWOR4B0QgHZu-1	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.196+00	{}
48S887wUb5BHhVU8vZRgO	task	fvIMpMLpSXdBl31eLtyZ0	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.22+00	{}
iE7u0cqS6u2Bm7080-1r9	task	oLFL1z8WqISduY9H3ggQQ	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.246+00	{}
ZOBaRP2ktWqh76HmUo5Av	task	GEo85cDIjUQT2hNNGSYGv	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.269+00	{}
DEW2ibswQVhr4wik3G6Ny	task	J1IavhoWpj_Bo4ouRlWPx	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.296+00	{}
MldS4kvtkYIHDpIZk6Box	task	9A-ZTabMAFUSIcIYGhYdV	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.322+00	{}
GUdh3E1ouGk_w1IPSTwfo	task	r8LTHRW654hrGafK1rcny	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.35+00	{}
yV6Duvy76GA9m0FrUkv-Z	task	Z3W5q84sDO9qDMZmPl8y7	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.38+00	{}
z6jQZ4gFdQWhlWIAsBXE_	task	Kn7CGIAes5uc1FxjvZVkO	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.411+00	{}
PS2mlbQrLtp53Xq4HOF6G	task	6XL2duCHIstwp3x6-CHmu	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.44+00	{}
n6aVoHy2cOgQUvYCNUmEd	task	SKmFS7UpyVG8pOE8g8MGv	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.47+00	{}
_L08ZZHBEgjBnr-FMGIQ6	task	aJBPQTGlgTw6yioCUCIti	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.505+00	{}
cCGaKwhoPbigFECk_eVK3	sector	Q13Y4dK-iRUroTASW7mCc	\N	created	\N	\N	Comunicação	\N	2026-03-19 15:31:01.778+00	\N
1jcplNpH4eq6eTL0G8NFs	sector	EB1iiNBWWwimHKWxVs-v4	\N	created	\N	\N	Cultivo	\N	2026-03-19 18:02:42.685+00	\N
jAKPG6RaShUB0NsFO4fkt	sector	_t2mzgj0UHQqaVx8GD_LU	\N	created	\N	\N	Financeiro	\N	2026-03-19 18:02:57.949+00	\N
qQ5GHuslH-uwymgHlMVr9	sector	HOdubaBeRyhT4T-iqJiO7	\N	created	\N	\N	Acolhimento	\N	2026-03-19 18:03:06.842+00	\N
RtYJPE8xL3ypDV3XDdPDO	sector	_drAcc69pmYACJHTc3XSF	\N	created	\N	\N	Expedição	\N	2026-03-19 18:03:12.378+00	\N
HGoMIqdJpo5wfFLj8nVak	sector	7Jm8g_VV0YQHlVU5e3qZ_	\N	created	\N	\N	Trima	\N	2026-03-19 18:03:16.743+00	\N
XjfpClLQc_cDTmO3lcA9o	sector	GPb-Lz-I0gwqx-Guwti0y	\N	created	\N	\N	Núcleo Terapêutico	\N	2026-03-19 18:03:31.824+00	\N
FUmr1saed9cwoevtVetng	task	7d6Rpa2DFJgoRXSavPMa2	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.535+00	{}
trT51c5VieqBJcGWveBDY	task	cqR6hNcI7MMr7rwZgX5KM	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.561+00	{}
k8LXIt7AZxM9EDuRQsusz	task	5Avr7l_Xdt66SqTQd1Azg	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.588+00	{}
UjrnpoFR6TqbxU4JCY6g7	task_action	BA6efAIuu5e7_bldP4ybU	\N	created	\N	\N	Ouvir expositores	\N	2026-03-19 22:26:57.82+00	\N
jJcK_gNC6742Xl9eCja8-	task_action	5r9JpDBoUpmhvO6lOA6rO	\N	created	\N	\N	Ouvir público	\N	2026-03-19 22:26:57.82+00	\N
_WoZeTtBBWi08d_Dq_n5v	task_action	keJOOmcONNLvFruoEWenO	\N	created	\N	\N	Avaliar resultados da edição anterior	\N	2026-03-19 22:26:57.82+00	\N
C2mmotraJV0yHIELuXpKZ	task_action	Q6CHd7aF38y7HgeI6uiPD	\N	created	\N	\N	Definir posicionamento da edição 2	\N	2026-03-19 22:26:57.821+00	\N
fB1GvmXOEihO-tPmofDdB	task	04fwTFSrAKjEDHIh0GRsp	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.614+00	{}
HYTxhMTCSOaxpgHwEQo8Z	initiative	init-exemplo	\N	updated	name	Iniciativa Exemplo	Eventos Adapta 2026	\N	2026-03-19 22:28:22.42+00	\N
Ez7q3ckQxwZhMc9GOdFaD	initiative	init-exemplo	\N	updated	description	Iniciativa demonstrativa que agrupa projetos estratégicos do setor.		\N	2026-03-19 22:28:22.431+00	\N
-rIxUB83yEKTW6udC4JiD	initiative	init-exemplo	\N	updated	sectorId	setor-exemplo	Q13Y4dK-iRUroTASW7mCc	\N	2026-03-19 22:28:22.439+00	\N
by_PPSLdKkIrttWKoK42h	initiative	init-exemplo	\N	updated	startDate	Thu Jan 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Jan 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-19 22:28:22.445+00	\N
MvRxKeQkdnaGCoOV6mdS3	initiative	init-exemplo	\N	updated	endDate	Tue Jun 30 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Dec 31 2026 03:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-19 22:28:22.451+00	\N
xMXHu6QpChT7NXlVKycuY	project	ODQmAaFfcbxJvfLt7HOaQ	\N	created	\N	\N	Febre de Arte de 2026	\N	2026-03-19 22:26:57.779+00	\N
4zxyX3X2FQAZq28KOlaLd	project_stage	AswqOgNP32Qw8OyzKVpTy	\N	created	\N	\N	Fase 0 — Decisões estruturais	\N	2026-03-19 22:26:57.788+00	\N
KuJeuIAL8p-1m0TaVuPcy	task	sCCxmwzo8NJnmseC0j4vB	\N	created	\N	\N	Modelo do evento	\N	2026-03-19 22:26:57.802+00	\N
0hSDovT0ynEJtv68xg47O	budget_item	fSiFH_8s-Z5DwQYWw_Uc8	\N	created	\N	\N	Pesquisa de mercado	\N	2026-03-19 22:26:57.839+00	\N
qTeM6Ta-ryepGhnp3xOoh	task	zsW5Wbs5l0KcT80PRf29_	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.64+00	{}
Oqx0v6NwBpzXMvHV8NEdy	task_action	GN96EM3TTscr_MBwfhn1E	\N	created	\N	\N	Avaliar resultados da edição anterior	\N	2026-03-19 22:30:05.249+00	\N
h60r94gpENv4BC398MFad	task_action	gcQIHuEdWdYgndkyjfXIO	\N	created	\N	\N	Ouvir expositores	\N	2026-03-19 22:30:05.249+00	\N
3svNuY6ZAE9Q5nbgVEIhR	project	4JRBxbSHPyMDq5Bz1udSZ	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	Febre de Arte de 2026	\N	2026-03-19 22:30:05.22+00	\N
n9vIeVtebaZ548Q9LodpG	project_stage	0fP5a69_q0TWmCkfnDUYM	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	Fase 0 — Decisões estruturais	\N	2026-03-19 22:30:05.233+00	\N
7Wnd6s81KIzRnTDQJBO2W	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	Modelo do evento	\N	2026-03-19 22:30:05.241+00	\N
W2I1jSp12769EBuXtlnQm	task_action	PBm60pyw_Ph-ETVrN55nM	\N	created	\N	\N	Ouvir público	\N	2026-03-19 22:30:05.25+00	\N
iYJ4gcqi2stm2g56Ts25r	task	xW4qR-R8ETP6LkCmGJfQz	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Wed Mar 04 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Fri Jun 05 2026 19:32:16 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 16:57:14.294+00	\N
krqLDaM3CUIK3dus6Yg_t	task	xW4qR-R8ETP6LkCmGJfQz	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Sat Mar 14 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Tue Jun 16 2026 19:32:16 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 16:57:14.295+00	\N
BtSW7c0clrFgzpFTP9TOz	task	KiLzqbWREKNTUfqoLq2nC	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Thu Mar 05 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Mar 05 2026 03:25:42 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 17:22:20.732+00	\N
eiN8QFKtn_pPNKFoFxuxB	task	JcgRirn59WZTvzGbHZcvh	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Sun Mar 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Mon Mar 02 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 17:34:59.84+00	\N
iaRatiI7PRSDJhA2iNgHI	task	JcgRirn59WZTvzGbHZcvh	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Wed Mar 04 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Mar 05 2026 23:59:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 17:34:59.841+00	\N
fzHkzlid5wmLRSD8qw9Gp	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Mon Mar 02 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Apr 23 2026 03:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 19:32:03.045+00	\N
Ikxxbrxso8Y7bhYZ2P4z4	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Thu Apr 23 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Mon Jun 15 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 19:32:03.046+00	\N
L-cvdWL6EYMdsXh-qg70x	task	-dAGQcelWb080ucSKv06A	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	teste	\N	2026-03-20 19:45:55.178+00	\N
CU3iXwtcz-Imxy94k12UD	task	F7HA0TauYIADhbtgo8uB_	proj-diamba	created	\N	\N	\N	\N	2026-03-21 02:13:27.47+00	{}
7VQeS2bdlbS1x7yxYvU49	task	LdyjGvueLe48Q7Lpby8xl	proj-diamba	created	\N	\N	\N	\N	2026-03-21 02:13:27.5+00	{}
yLguUWQWNV94Cj4ZH8edY	task	uZea46b0dPiO_MPDCM9yQ	proj-diamba	created	\N	\N	\N	\N	2026-03-21 02:16:36.003+00	{}
qJKvhRUlEcqbWcEWAy-GP	task	TFGFr9uOtzlyg7hPNHno5	proj-diamba	created	\N	\N	\N	\N	2026-03-21 02:16:36.058+00	{}
Zc4aKwUNY_1KxXs9zZW70	project	RymFNMit610t-YkiEq1GI	\N	created	\N	\N	\N	\N	2026-03-21 02:33:00.338+00	{}
yuZ941Ws_opDW73uj2Ne9	projectStage	yCRTCtZkVqCpXCDD7Zjo9	RymFNMit610t-YkiEq1GI	created	\N	\N	\N	\N	2026-03-21 02:33:00.372+00	{}
nkL0XM64MXg6Oqg6dTeE-	projectStage	r1qyxGyGgTv_dpUHhxbjy	RymFNMit610t-YkiEq1GI	created	\N	\N	\N	\N	2026-03-21 02:33:00.392+00	{}
HD34OgjnfucYg-urQk6K9	projectStage	iv_SWWYyv34KB4PjlXH5d	RymFNMit610t-YkiEq1GI	created	\N	\N	\N	\N	2026-03-21 02:33:00.411+00	{}
Utiy3BP6_PncpXIrl_hWp	task	4yhRAcC_Xn_8_HTjI1_Eg	RymFNMit610t-YkiEq1GI	created	\N	\N	\N	\N	2026-03-21 02:33:00.442+00	{}
bSNhp6pM7gt1O2X-aEj3R	task	UUlpuZxJuQFvP1kuaU96g	RymFNMit610t-YkiEq1GI	created	\N	\N	\N	\N	2026-03-21 02:33:00.464+00	{}
FtpRJZp2vUegMYFwgwIbz	task	Qu9Tx1Z2J4tV17uH8-dPz	RymFNMit610t-YkiEq1GI	created	\N	\N	\N	\N	2026-03-21 02:33:00.49+00	{}
qwWb7p_3laRkU3savhv9r	task	G1IPRWnvjWbv4HUJVPJ6a	RymFNMit610t-YkiEq1GI	created	\N	\N	\N	\N	2026-03-21 02:33:00.517+00	{}
xwBzxjkHZbe8RHMabmfnI	initiative	HUCUw0tiiPZFwKX3OmbSn	\N	created	\N	\N	__test_tipo_contexto_1774061805819	\N	2026-03-21 02:56:46.756+00	\N
27wVMq5lypOOj1kWtskwZ	project	80-8PjQ80dNKWVdL4Ydza	\N	created	\N	\N	\N	\N	2026-03-21 03:17:31.019+00	{}
F264fz_eCi4u-mATrfqyA	projectStage	dYm2jx50um63x6Dwrtc3e	80-8PjQ80dNKWVdL4Ydza	created	\N	\N	\N	\N	2026-03-21 03:17:31.072+00	{}
KjWb11hEOC2h9DmZy1GJa	task	CB-frDiTJ2t2Ir3Ddp-IV	80-8PjQ80dNKWVdL4Ydza	created	\N	\N	\N	\N	2026-03-21 03:17:31.116+00	{}
6DZBXWQtsY6hkefUYOj0X	task	t0psS_sKMqnl3i8qAQfIf	80-8PjQ80dNKWVdL4Ydza	created	\N	\N	\N	\N	2026-03-21 03:17:31.171+00	{}
6IXhdB8Gb5RN-1yaZ09sp	task	74ySZ6bhuA0ugVkUp0vCx	80-8PjQ80dNKWVdL4Ydza	created	\N	\N	\N	\N	2026-03-21 03:17:31.209+00	{}
DNTECW2pN-Mu21is6wYZr	task	sMM46xU1PiqNYjFj7A7Yd	80-8PjQ80dNKWVdL4Ydza	created	\N	\N	\N	\N	2026-03-21 03:17:31.245+00	{}
gZ7irZVn13eOw899I8ry5	task	f1l8E9hFQD_4HTougUE4-	BNj9FcMOiVxgeHmgOxdlR	created	\N	\N	\N	\N	2026-03-21 03:34:58.668+00	{}
ySdO1YMJgeHUSJqD3GJpt	project	proj-lab	proj-lab	updated	category	infrastructure	event	\N	2026-03-21 04:15:32.146+00	\N
ULcnFr-VMf9rVEC_EETBE	project	proj-lab	proj-lab	updated	ownerId	\N	WuvgBttO_q5f5gTOWONH6	\N	2026-03-21 04:15:32.147+00	\N
B545ueuRFLvAmb1w8XoMT	project_stage	-SGhKyEyDmZ9HAkJ8aO4p	dHAjDApevTvgt5ol9x6-Y	created	\N	\N	PARTE UM - COMO FUNCIONA A ETAPA 	\N	2026-03-21 18:21:55.036+00	\N
_cnPILaPJBqwwyHy9AbgW	task_action	usM2lsxwBIVVI9ZDVsnTL	\N	created	\N	\N	\N	\N	2026-03-21 18:31:25.737+00	"{\\"title\\":\\"Revisar o funcionamento a partir dessa ação teste.\\",\\"taskId\\":\\"lL3KKrNY7VDj5rQWY_bEo\\"}"
viCK-l2LBum7EgbRvl5Ig	task_action	no1G8yfbYc9SJ1z3xdHld	\N	created	\N	\N	Definir posicionamento da edição 2	\N	2026-03-19 22:30:05.25+00	\N
Os7kcU11DSlp_uHlUmtpS	task	KiLzqbWREKNTUfqoLq2nC	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Sat Mar 07 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sun Mar 08 2026 03:25:42 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 17:22:20.733+00	\N
6JWuATK94BD2JqQXSklPv	initiative	c3X5vu0H-sPyRQ9pNehJa	\N	created	\N	\N	Test Auto-Approve	membro-exemplo	2026-03-20 00:24:01.834+00	\N
1O3dxo_PQP2WSw-cm88XX	initiative	uUu9aJKEVEv-wq6yhzlG7	\N	created	\N	\N	Test Same Person	membro-exemplo	2026-03-20 00:24:02.734+00	\N
cGFFl3-J_rs_7Bfc5srNw	initiative	c3X5vu0H-sPyRQ9pNehJa	\N	deleted	\N	Test Auto-Approve	\N	\N	2026-03-20 00:24:04.604+00	\N
TX7nQ_-BvvR-ozAj8RH8W	initiative	uUu9aJKEVEv-wq6yhzlG7	\N	deleted	\N	Test Same Person	\N	\N	2026-03-20 00:24:05.519+00	\N
bEEZhWEz3pG5Ne6_cUi3S	initiative	yGIW-hCMh8i0FrVrN_VK4	\N	created	\N	\N	Test Different Person Real	membro-exemplo	2026-03-20 00:24:23.935+00	\N
CJxCKqLpENjI7EtdYD60V	initiative	yGIW-hCMh8i0FrVrN_VK4	\N	deleted	\N	Test Different Person Real	\N	\N	2026-03-20 00:24:24.801+00	\N
1PzgeDXhuGNQGo97QAZ4G	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Thu Apr 23 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Apr 23 2026 03:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 19:32:04.946+00	\N
vyRURLG5aQDp_z7K0SwrM	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Mon Jun 15 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Mon Jun 15 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 19:32:04.946+00	\N
9yAA95AhfxX30Ebmvpx3h	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	shift	morning	afternoon	\N	2026-03-20 19:32:04.947+00	\N
zN1MyUzMSoIP2Zvf2TQvV	initiative	AFdrUuqFnIaHR1J1Mv__A	\N	created	\N	\N	\N	\N	2026-03-21 02:13:28.608+00	{}
4wTGW7M1F6Jqs5vW0tzfo	initiative	x3fDqP3zpCPyge0T3TALv	\N	created	\N	\N	\N	\N	2026-03-21 02:16:37.688+00	{}
Tuq2rMjzqfUXbng1PUIZ_	initiative	2WLlFQxMVbM0dOzYksHmc	\N	created	\N	\N	Mudança - Escritório Adapta	\N	2026-03-21 02:34:13.185+00	\N
TnB9T_E5iTY6zghaYKkCo	initiative	HUCUw0tiiPZFwKX3OmbSn	\N	updated	type	Evento	Campanha	\N	2026-03-21 02:56:47.745+00	\N
9ou7oIZHSP3F2-ZKWcn4d	initiative	HUCUw0tiiPZFwKX3OmbSn	\N	updated	context	Externo	Híbrido	\N	2026-03-21 02:56:47.755+00	\N
nrHlNGBIMZhDicGWZI1g1	initiative	9olqHjd-FCgj7HwdLo24I	\N	created	\N	\N	Inauguração Escritório Adapta	\N	2026-03-21 03:18:52.827+00	\N
FzTn3ooCorHDMfh4_HZhP	project	NI7gigVLVN-_fBKnhgKB_	\N	created	\N	\N	\N	\N	2026-03-21 03:52:12.299+00	{}
hFKVKa_8tg35lBRe7JKcp	project	proj-sementes	proj-sementes	updated	category	operational	strategic	\N	2026-03-21 04:16:09.61+00	\N
jVG9CgtO3L1l-VekEfeAN	project	proj-sementes	proj-sementes	updated	ownerId	\N	mem-tonio	\N	2026-03-21 04:16:09.611+00	\N
kq7jifuW1H0ms16r0aBhi	initiative	2WLlFQxMVbM0dOzYksHmc	\N	updated	type	\N	Operação	\N	2026-03-21 04:30:05.991+00	\N
gcZAZEeUOHVy47HcK8X9g	initiative	2WLlFQxMVbM0dOzYksHmc	\N	updated	context	\N	Híbrido	\N	2026-03-21 04:30:06.01+00	\N
89KLfWP_40TG3MuchLg-H	initiative	2WLlFQxMVbM0dOzYksHmc	\N	status_changed	status	solicitada	em_andamento	\N	2026-03-21 04:30:06.017+00	\N
9Jl3O36SCLqpSW6LNVjL6	initiative	2WLlFQxMVbM0dOzYksHmc	\N	updated	sectorId	\N	677e1eee-b038-4eda-9c19-d893346723e6	\N	2026-03-21 14:44:11.665+00	\N
c7s1nhXXEqzMy1JobhPJM	initiative	zNIBcetH24aAahz3t-cKm	\N	created	\N	\N	FUNCIONAR DE PONTA A PONTA	\N	2026-03-21 18:11:35.072+00	\N
zZojXrAlypkOfRyXfncu3	task	lL3KKrNY7VDj5rQWY_bEo	dHAjDApevTvgt5ol9x6-Y	created	\N	\N	Testar o sistema de cabo a cabo	\N	2026-03-21 18:25:28.781+00	\N
qNdwkbsEU1f-LvgiDPmGo	project_stage	-SGhKyEyDmZ9HAkJ8aO4p	dHAjDApevTvgt5ol9x6-Y	updated	startDate	\N	Sat Mar 21 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-21 18:35:55.753+00	\N
qP1hcJ-7S5sQfdC5lBU1-	project_stage	-SGhKyEyDmZ9HAkJ8aO4p	dHAjDApevTvgt5ol9x6-Y	updated	endDate	\N	Sun Mar 22 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-21 18:35:55.759+00	\N
dwU9RxvsxX0tZTX5l6gJx	project_stage	fXAUrX92erOwAN5Fl1haN	Cal3gIEOcpVx2MeGGLvlJ	created	\N	\N	pré-mudança	\N	2026-03-21 19:20:50.177+00	\N
U9SvvFF8HJm_gXzjfxQoa	task	78IXTP87dovZH4GIHO5jt	dHAjDApevTvgt5ol9x6-Y	created	\N	\N	teste2	\N	2026-03-21 20:51:53.903+00	\N
W__sCjtOKAv1-hpBldezn	task_action	3hI8_mWM23gdiVnXKy3vu	\N	created	\N	\N	Comparar cenários	\N	2026-03-20 04:35:08.715+00	\N
U5Drw3sTcfZ6L-f9nNxwi	task_action	GsYf4V1R_TDwdvxmLEmd9	\N	created	\N	\N	Analisar dados financeiros	\N	2026-03-20 04:35:08.714+00	\N
OyrkTFpwONoBZr8xH9RRW	task_action	WLZ9HTnG2fctShT25GbAk	\N	created	\N	\N	Consolidar aprendizados	\N	2026-03-20 04:35:08.715+00	\N
je1Hrhvfm33dvOoK6QpY7	task_action	y6hXgrZfg7lDq9nX7sXDd	\N	created	\N	\N	Decidir posicionamento	\N	2026-03-20 04:35:08.715+00	\N
nknKgra16rif79II8lCOe	task_action	ZanBHNMrqS9Dv1mVFpnjA	\N	created	\N	\N	Mapear locais	\N	2026-03-20 04:35:08.715+00	\N
5qOGShe-VHGW9nt-K9zXh	task_action	2oGylpZ2EKWST3CGgWgu1	\N	created	\N	\N	Comparar custos	\N	2026-03-20 04:35:08.715+00	\N
iEbBeGeMeLDw9t7mOA_0E	task_action	ehnM4kc2jAxfvZIy-w5fY	\N	created	\N	\N	Negociar espaço	\N	2026-03-20 04:35:08.715+00	\N
9kXAuP8QwZi1QbhC6lWm2	budget_item	0d7PMKP0SEhKQICU9i1kP	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	Pesquisa de mercado	\N	2026-03-19 22:30:05.261+00	\N
yz9UaHzjKj1SH1-jA_pqV	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Sun Mar 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Mar 05 2026 13:08:44 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:15:35.949+00	\N
DTow7HGWiaLYY5hTVs1A-	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Sun Mar 15 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Fri Mar 20 2026 13:08:44 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:15:35.949+00	\N
1HYmo7rfTALr6ALfGTm8W	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Thu Mar 05 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Tue Feb 03 2026 10:33:09 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:15:41.422+00	\N
9GVHnLQNJt5L3VJsy0bGe	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Fri Mar 20 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Fri Mar 20 2026 23:59:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:15:41.423+00	\N
rseAgJQmHsPCl-ZNZILTH	initiative	init-infraestrutura	\N	updated	responsibleId	\N	uChin6OQDct_Z_VQIV1ae	\N	2026-03-20 17:24:28.07+00	\N
wP-XywP6a28IZualLllr6	project	3YfDRu5p9T0VtHAPAcZYW	\N	created	\N	\N	\N	\N	2026-03-20 04:43:40.331+00	{}
ev9s_BVrtsyPhnR0oJSB0	initiative	init-infraestrutura	\N	updated	sectorId	\N	_t2mzgj0UHQqaVx8GD_LU	\N	2026-03-20 17:24:28.078+00	\N
WYqDUjJ8KAp2KxXerMsDi	initiative	init-infraestrutura	\N	updated	startDate	Thu Jan 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Jan 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 17:24:28.083+00	\N
4IQzL1iYc8h71qEz5J4ym	projectStage	ihWZ_poIBy8OyMkzSTSxG	\N	created	\N	\N	\N	\N	2026-03-20 04:43:40.351+00	{}
V-CS4Kn87rk7r13k5ItWD	budgetItem	GWhhO8IAdY-5JMRtZpm3r	\N	created	\N	\N	\N	\N	2026-03-20 04:43:40.367+00	{}
xD5llS6_PbSnQNPq7-uyZ	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Thu Apr 23 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Mon Apr 20 2026 03:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 19:33:11.323+00	\N
UTM_j6-oHHZOKojV-QHKi	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Mon Jun 15 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sat Jun 13 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 19:33:11.324+00	\N
8ZIlsGgw8IevHDseDB5i3	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	shift	afternoon	morning	\N	2026-03-20 19:33:11.325+00	\N
9CR-zBhOp1NuBdJCbMPxC	project	EeTFVga0-SObdTlyFFVwc	\N	created	\N	\N	\N	\N	2026-03-21 02:13:29.577+00	{}
jdOy_XyNzrQu2o-zE4fHY	projectStage	Baj4oPhF6sCU193_MXgFz	\N	created	\N	\N	\N	\N	2026-03-21 02:13:29.609+00	{}
jYgJthGpidPwYz15xWN7e	task	iwEg9VrlrO6FIOCfPghOf	\N	created	\N	\N	\N	\N	2026-03-21 02:13:29.639+00	{}
bFL0JmBb94ku1J8CosFlo	task	BUwCKKZq9YNz3rmKhsVcP	\N	created	\N	\N	\N	\N	2026-03-21 02:13:29.67+00	{}
aCaJvs9WX_CqbYbQ0ilV-	initiative	HUCUw0tiiPZFwKX3OmbSn	\N	deleted	\N	__test_tipo_contexto_1774061805819	\N	\N	2026-03-21 02:56:50.133+00	\N
hzBgw2kfAjavQuRTYGfha	project	jjHOHzKugVjNWcji3tosg	jjHOHzKugVjNWcji3tosg	created	\N	\N	Inauguração	\N	2026-03-21 03:22:31.736+00	\N
71QaWWfclQ_itIM621wML	project	gy1pc2fXYVeP--OSE-Dfc	\N	created	\N	\N	\N	\N	2026-03-20 04:50:30.082+00	{}
docpl-bL6wgBcB01NQiqL	task	2BUl9FxfWh-32-TWT5mO1	\N	created	\N	\N	\N	\N	2026-03-20 04:50:30.099+00	{}
b91WS3kD2hFzDX41pMCbG	project	mO_cII7rQhZ8ZCOJUakgv	\N	created	\N	\N	\N	\N	2026-03-20 04:52:28.815+00	{}
KWo8WMgXoKuSOvGx2WsXa	projectStage	ec6hbVNe2BVtom7K8sAwI	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 04:52:28.832+00	{}
FjWIkvaIwfMeplR5Vo99i	task	JcgRirn59WZTvzGbHZcvh	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 04:52:28.852+00	{}
IfXsL6IR4Ej0zcv619uCL	task	KiLzqbWREKNTUfqoLq2nC	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 04:52:28.869+00	{}
_1YQ3l_L3dYWushdGUrop	task	xW4qR-R8ETP6LkCmGJfQz	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 04:52:28.886+00	{}
S8aZMru0TcOsTRnae42Mk	taskAction	L_Xjwb691CO6xBctqE_B8	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 04:52:28.903+00	{}
VsroDDqKIw2DDf8yKVr7k	taskAction	DyJlcpHGGCCc4-eCfOddL	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 04:52:28.918+00	{}
y-jAQAP6IVjffkI4TLo94	taskAction	qNPkhs4z2wzpYssRgZOdw	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 04:52:28.933+00	{}
2Qo-cH7MPGu4Sv9e3ANlx	taskAction	B_FffQU8VuYAs1YsWdTyG	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 04:52:28.948+00	{}
reFl-VKNeGRiucrhbxcgV	taskAction	i7sTGfLtKIZqCeI6wLNGH	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 04:52:28.963+00	{}
aag0q4-n--BGywsp2XL-Z	taskAction	u05miCNriJ6T2JahqjGXm	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 04:52:28.98+00	{}
2mgGb98GoC840Cyw_vhw6	taskAction	PlFwgMJAvw51MiepHOXav	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 04:52:28.996+00	{}
JIiUD3qau3dZCQfGEjV9s	budgetItem	ovNUB5_nAnLDvmDTtyCZN	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 04:52:29.01+00	{}
BE7Rbw_LzC-nlkwxp-dgJ	task	xW4qR-R8ETP6LkCmGJfQz	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Thu Mar 05 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Tue Mar 03 2026 03:08:08 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:52:55.309+00	\N
yCh9YVIk40o_GMnySwY8v	task	xW4qR-R8ETP6LkCmGJfQz	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Thu Mar 12 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Wed Mar 11 2026 03:08:08 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:52:55.31+00	\N
z1-NWBL-AjV2hULshMyUT	task	xW4qR-R8ETP6LkCmGJfQz	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Tue Mar 03 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Tue Mar 03 2026 17:27:06 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 13:14:50.139+00	\N
gMtC7coJNgMSFNlID7rgf	task	xW4qR-R8ETP6LkCmGJfQz	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Wed Mar 11 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Mar 12 2026 17:27:06 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 13:14:50.14+00	\N
vjgv0ylMElsGwiQXZhLDy	project	proj-reforma	proj-reforma	updated	ownerId	\N	uChin6OQDct_Z_VQIV1ae	\N	2026-03-21 04:16:39.21+00	\N
v6Ith_TV9a_2lvoTie1G8	task	-dAGQcelWb080ucSKv06A	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Fri Mar 20 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Jan 22 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-21 14:50:11.493+00	\N
Fl4dOMD3t7ulQFBACKjIP	task	xW4qR-R8ETP6LkCmGJfQz	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Tue Mar 03 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Wed Mar 04 2026 23:51:34 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 13:20:13.801+00	\N
mgPctZORg8SsJkTGZmSYK	task	xW4qR-R8ETP6LkCmGJfQz	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Thu Mar 12 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sat Mar 14 2026 23:51:34 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 13:20:13.802+00	\N
so1zMJFjS5bUNU_42gKsj	task	-dAGQcelWb080ucSKv06A	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Tue Mar 31 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Tue Mar 31 2026 23:59:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-21 14:50:11.493+00	\N
icBJ6FOunjLDdVP_7cGMN	initiative	zNIBcetH24aAahz3t-cKm	\N	updated	sectorId	\N	Q13Y4dK-iRUroTASW7mCc	\N	2026-03-21 18:11:51.287+00	\N
HhrOz2icPNoCRRytQvY1X	task	lL3KKrNY7VDj5rQWY_bEo	dHAjDApevTvgt5ol9x6-Y	updated	stageId	\N	-SGhKyEyDmZ9HAkJ8aO4p	\N	2026-03-21 18:30:25.18+00	\N
MpJFtK4ZKDV8JlRfjWYRb	task	lL3KKrNY7VDj5rQWY_bEo	dHAjDApevTvgt5ol9x6-Y	updated	startDate	Sat Mar 21 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sat Mar 21 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-21 18:43:24.504+00	\N
CFs3nps6grV839RzKCarC	task	lL3KKrNY7VDj5rQWY_bEo	dHAjDApevTvgt5ol9x6-Y	updated	endDate	Sat Mar 21 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sat Mar 21 2026 23:59:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-21 18:43:24.504+00	\N
NEDlmhn_PuQLEY4i5WQDF	task	JcgRirn59WZTvzGbHZcvh	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Mon Mar 02 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Mon Mar 02 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-21 20:52:35.002+00	\N
xFoVaneexpt0ORzYhL5pR	task	JcgRirn59WZTvzGbHZcvh	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Sun Mar 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sun Mar 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 15:19:21.035+00	\N
S8NWbou-rwFr2HfEYPEXR	task	JcgRirn59WZTvzGbHZcvh	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Tue Mar 03 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Wed Mar 04 2026 13:46:39 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 15:19:21.035+00	\N
6fgyItKWcV_BWn7wPKOu9	projectStage	exKbprh_yKIjl8Ty8W2rD	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 15:48:02.849+00	{}
9imhsjjJQ3Etq4wj2_1sz	task	aRRTwMtib_acYyXDWMfRj	mO_cII7rQhZ8ZCOJUakgv	created	\N	\N	\N	\N	2026-03-20 15:48:02.882+00	{}
FeQVR6DceKZsJX7BY1CF6	initiative	init-tecnologia	\N	updated	responsibleId	\N	mem-tonio	\N	2026-03-20 17:24:58.614+00	\N
LqKXHaXPH6zLxibBBHVFc	initiative	init-tecnologia	\N	updated	sectorId	\N	EB1iiNBWWwimHKWxVs-v4	\N	2026-03-20 17:24:58.623+00	\N
H4ClovR8O-zVghHgJiF4i	initiative	init-tecnologia	\N	updated	startDate	Thu Jan 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Jan 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 17:24:58.628+00	\N
u5RZAPP3iOJDwsWt0BBGU	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Mon Apr 20 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Mon Apr 20 2026 03:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 19:33:34.828+00	\N
N9PqNQyKFmC0CKU6xgZvb	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Sat Jun 13 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sun Jun 14 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 19:33:34.829+00	\N
b2L0_7Hkdn0pOINOnOALc	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	shift	morning	night	\N	2026-03-20 19:33:34.83+00	\N
1zAaJmOAOqvRuLGfQEmqN	task	BlOS2Lo13ygf0Kb9sjeRG	proj-diamba	created	\N	\N	\N	\N	2026-03-21 02:16:19.244+00	{}
b3HZ_-B73ZaK5U5KN8fbu	task	FeQFKI4A0yXLxdELAEfzZ	proj-diamba	created	\N	\N	\N	\N	2026-03-21 02:16:19.266+00	{}
DJhilHrsrQ2-iLPvay4uo	project	Cal3gIEOcpVx2MeGGLvlJ	Cal3gIEOcpVx2MeGGLvlJ	created	\N	\N	Adequações, reforma e melhorias	\N	2026-03-21 03:25:07.871+00	\N
ekt-n-HwakgK6I9O1-VYS	project	BNj9FcMOiVxgeHmgOxdlR	BNj9FcMOiVxgeHmgOxdlR	updated	initiativeId	\N	2WLlFQxMVbM0dOzYksHmc	\N	2026-03-21 03:56:01.497+00	\N
0878FA0VlctW0psam-_uz	project	proj-diamba	proj-diamba	updated	startDate	2026-01-01T00:00:00.000Z	2026-04-03T00:00:00.000Z	\N	2026-03-21 04:17:15.014+00	\N
qhpM9Ax9fGagy7rZ46ydx	project	proj-diamba	proj-diamba	updated	endDate	2026-12-31T00:00:00.000Z	2026-04-04T00:00:00.000Z	\N	2026-03-21 04:17:15.015+00	\N
qsjV9Cj9q2IF3sQqhCB1V	task	-dAGQcelWb080ucSKv06A	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Thu Jan 22 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sat Feb 21 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-21 14:50:17.261+00	\N
hX2huLIdvklC9ZKXBEvv5	task	-dAGQcelWb080ucSKv06A	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Tue Mar 31 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Wed Mar 04 2026 23:59:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-21 14:50:17.261+00	\N
CgslyNU7HXRfFNmZMYkhf	initiative	zNIBcetH24aAahz3t-cKm	\N	updated	responsibleId	\N	membro-exemplo	\N	2026-03-21 18:11:54.752+00	\N
rP_NyYKrDaVeT8XOcH1RH	task	lL3KKrNY7VDj5rQWY_bEo	dHAjDApevTvgt5ol9x6-Y	updated	progress	0	45	\N	2026-03-21 18:30:27.731+00	\N
o5W9vM00tMcEFWJgWI4on	task	JcgRirn59WZTvzGbHZcvh	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Thu Mar 05 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Mar 05 2026 23:59:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-21 20:52:35.003+00	\N
xPMiu-LNAz7qrljBEgKZH	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Tue Feb 03 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Wed Feb 11 2026 16:28:11 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:26:44.199+00	\N
tDy0qa0a_qgof0zKej2GV	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Fri Mar 20 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sun Mar 29 2026 16:28:11 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:26:44.2+00	\N
ZPKczl0NSwGefXrscl1nO	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Wed Feb 11 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Fri Feb 06 2026 01:39:03 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:26:46.741+00	\N
f-ArzVdpRLehvOm36b8Mt	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Sun Mar 29 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Tue Mar 24 2026 01:39:03 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:26:46.742+00	\N
wlD3TP5_LbZ9tVOVCcMw0	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Fri Feb 06 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Mon Mar 02 2026 05:43:05 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:26:56.098+00	\N
26pb9VDjM-UHHJCNzF4eH	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Tue Mar 24 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sat Apr 18 2026 05:43:05 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:26:56.099+00	\N
e7qg5111jX4Ex-kypIZdN	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Mon Mar 02 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sat Mar 07 2026 21:08:08 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:27:04.149+00	\N
l2pXNeQAjQ7t1UOIs9_xp	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Sat Apr 18 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Fri Apr 24 2026 21:08:08 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:27:04.15+00	\N
YNhs_gwtQCTyusdQz_w4U	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Sat Mar 07 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sun Mar 01 2026 15:56:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:27:10.055+00	\N
RLsxdmvkOhEGfrEyc7MYj	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Fri Apr 24 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sun Apr 19 2026 15:56:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:27:10.056+00	\N
zOpOAiUSEy057_0XmxWt2	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Sun Mar 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Mon Mar 02 2026 04:42:41 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:30:00.083+00	\N
wawaT5PkooGVSzqEIVJdv	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Sun Apr 19 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Tue Apr 21 2026 04:42:41 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:30:00.084+00	\N
xcA5axFKtLKu-5FGItiRI	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Mon Mar 02 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Mon Mar 02 2026 23:43:05 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:30:04.437+00	\N
S4zzpZCUW2_oA47kZXYsc	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Tue Apr 21 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Tue Apr 21 2026 23:59:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 04:30:04.437+00	\N
mGkVEFSWVJ7is3pQJHric	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Mon Mar 02 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Sat Feb 28 2026 21:52:44 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 13:20:09.005+00	\N
Ig9KWorhK_boaHud8idiT	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Tue Apr 21 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Tue Apr 21 2026 23:59:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 13:20:09.006+00	\N
WpF0PXTX1R8uFaNhJcMTQ	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Sat Feb 28 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Mon Mar 02 2026 17:59:17 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 13:22:30.265+00	\N
Mq1y7OL4-pA7cWCB3i74F	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Tue Apr 21 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Fri Apr 24 2026 17:59:17 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 13:22:30.266+00	\N
DPOuiS6xhXGAcXz-7ueCP	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Mon Mar 02 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Fri Mar 06 2026 21:28:25 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 13:28:14.41+00	\N
usSdorTcZ76U3hPGZt3Co	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Fri Apr 24 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Fri Apr 24 2026 23:59:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 13:28:14.411+00	\N
LNfoA4ps_sTvqC8NLqvyD	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Fri Mar 06 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Mar 05 2026 07:37:21 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 14:11:03.865+00	\N
GNrYoo3RQOoXuAyPLeqhr	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Fri Apr 24 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Fri Apr 24 2026 07:37:21 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 14:11:03.866+00	\N
BsDPyBuy8b-OuEVQkTAzj	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Thu Mar 05 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Tue Mar 03 2026 13:44:12 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 14:37:45.9+00	\N
AYMYW1j5n_YSaCjrFMBgo	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Fri Apr 24 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Apr 23 2026 13:44:12 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 14:37:45.901+00	\N
WcLRRIaaHWXJR1ioZ6VJL	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Tue Mar 03 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Tue Mar 03 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 15:05:38.452+00	\N
rbFfQCbM2YP8FqegfWozJ	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Thu Apr 23 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Apr 23 2026 23:59:59 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 15:05:38.453+00	\N
fpcfbXBTtFlxGc0pMTnEe	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	startDate	Tue Mar 03 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Mon Mar 02 2026 07:34:15 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 15:05:42.104+00	\N
OF_-sMDg9VT3Las5bM4Z1	task	1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	updated	endDate	Thu Apr 23 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Apr 23 2026 07:34:15 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 15:05:42.105+00	\N
YrIEgUNqsaOIRwXZfsi6V	initiative	init-tecnologia	\N	updated	responsibleId	mem-tonio	uChin6OQDct_Z_VQIV1ae	\N	2026-03-20 17:25:31.966+00	\N
6FpAoaRPO0l9lv7ZIX9a9	initiative	init-tecnologia	\N	updated	sectorId	EB1iiNBWWwimHKWxVs-v4	_t2mzgj0UHQqaVx8GD_LU	\N	2026-03-20 17:25:31.976+00	\N
3Su0zqPhS-U_nyZ7rll16	initiative	init-tecnologia	\N	updated	startDate	Thu Jan 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	Thu Jan 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)	\N	2026-03-20 17:25:31.981+00	\N
CeulZygVMlP1zTrbFXobf	project	aJbTv9Y37nSIfcqdEgReJ	\N	created	\N	\N	\N	\N	2026-03-21 02:16:19.982+00	{}
I9qg8gq2kZByKC2B-fdQf	projectStage	VgKxRhTURRskU_fL7Blx_	\N	created	\N	\N	\N	\N	2026-03-21 02:16:20.022+00	{}
HEWHusreUOagOP_Crng4k	task	1Iy8R8peVZ_6_c0HYLAbM	\N	created	\N	\N	\N	\N	2026-03-21 02:16:20.072+00	{}
poNoibkijl0r-BvdTbFXu	initiative	9olqHjd-FCgj7HwdLo24I	\N	deleted	\N	Inauguração Escritório Adapta	\N	\N	2026-03-21 03:33:57.838+00	\N
SOofUZOnU8OCTTx_cDN_Z	project	BNj9FcMOiVxgeHmgOxdlR	BNj9FcMOiVxgeHmgOxdlR	updated	initiativeId	2WLlFQxMVbM0dOzYksHmc	\N	\N	2026-03-21 04:03:49.764+00	\N
BC_zFTnDzu6uPl-fq91oS	project	dHAjDApevTvgt5ol9x6-Y	dHAjDApevTvgt5ol9x6-Y	created	\N	\N	UMA CADEIA COMPLETA	\N	2026-03-21 18:12:45.446+00	\N
5st3WumikmyV915R6V_tn	task	lL3KKrNY7VDj5rQWY_bEo	dHAjDApevTvgt5ol9x6-Y	updated	progress	45	15	\N	2026-03-21 18:30:28.327+00	\N
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, company_name, contact_name, role, phone, email, website, address, city, zip, primary_color, secondary_color, logo_bg_color, logo_bg_opacity, logo_plus_color, logo_plus_opacity, logo_ad_color, logo_ad_opacity, created_at, updated_at) FROM stdin;
1	Adapta 					www.adaptacann.com.br				#555555	#888888	#ffffff	1.00	#888888	1.00	#444444	1.00	2026-03-18 16:26:28.927108+00	2026-03-21 00:30:53.369+00
\.


--
-- Data for Name: budget_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_items (id, project_id, category, description, vendor, predicted_amount, contracted_amount, paid_amount, status, due_date, created_at) FROM stdin;
ovNUB5_nAnLDvmDTtyCZN	mO_cII7rQhZ8ZCOJUakgv	Estrutura	\N	Local	15000.00	0.00	0.00	pending	2026-03-10	2026-03-20 04:52:29.005853+00
0d7PMKP0SEhKQICU9i1kP	mO_cII7rQhZ8ZCOJUakgv	Pesquisa de mercado	Custos de pesquisa	Instituto Pesquisa	5000.00	\N	\N	pending	2026-03-20	2026-03-19 22:30:05.084+00
\.


--
-- Data for Name: campaign_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaign_posts (id, campaign_id, title, content, channel, scheduled_date, created_at) FROM stdin;
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaigns (id, name, type, duration, channels, objective, target_audience, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: executions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.executions (id, task_action_id, operator_id, started_at, ended_at, duration_minutes, notes, status, created_at) FROM stdin;
\.


--
-- Data for Name: initiatives; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.initiatives (id, name, description, responsible_id, status, start_date, end_date, created_at, updated_at, sector_id, assigned_team_id, solicitante_id, type, context) FROM stdin;
init-exemplo	Eventos Adapta 2026		membro-exemplo	em_andamento	2026-01-01 00:00:00+00	2026-12-31 03:00:00+00	2026-03-19 15:00:20.504877+00	2026-03-19 22:28:22.403+00	Q13Y4dK-iRUroTASW7mCc	\N	\N	\N	\N
init-infraestrutura	Infraestrutura & Operações	Iniciativa focada em melhorias estruturais e operacionais	uChin6OQDct_Z_VQIV1ae	em_andamento	2026-01-01 00:00:00+00	\N	2026-03-20 01:09:31.96322+00	2026-03-20 17:24:28.051+00	_t2mzgj0UHQqaVx8GD_LU	\N	\N	\N	\N
init-tecnologia	Tecnologia & Inovação	Iniciativa de modernização e automação de processos	uChin6OQDct_Z_VQIV1ae	em_andamento	2026-01-01 00:00:00+00	\N	2026-03-20 01:09:31.96322+00	2026-03-20 17:25:31.96+00	_t2mzgj0UHQqaVx8GD_LU	\N	\N	\N	\N
2WLlFQxMVbM0dOzYksHmc	Mudança - Escritório Adapta		\N	em_andamento	\N	\N	2026-03-21 02:34:13.102+00	2026-03-21 14:44:11.64+00	677e1eee-b038-4eda-9c19-d893346723e6	\N	WuvgBttO_q5f5gTOWONH6	Operação	Híbrido
zNIBcetH24aAahz3t-cKm	FUNCIONAR DE PONTA A PONTA		membro-exemplo	solicitada	\N	\N	2026-03-21 18:11:35.008+00	2026-03-21 18:11:54.744+00	Q13Y4dK-iRUroTASW7mCc	\N	WuvgBttO_q5f5gTOWONH6	Operação	Interno
backlog-initiative	Backlog	Iniciativa padrão para projetos sem iniciativa vinculada	\N	em_andamento	\N	\N	2026-03-21 18:57:29.660332+00	2026-03-21 18:57:29.660332+00	\N	\N	\N	\N	\N
\.


--
-- Data for Name: login_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_attempts (id, email, attempted_at, success) FROM stdin;
14	gabriela92dias@gmail.com	2026-03-21 14:32:21.563+00	t
\.


--
-- Data for Name: module_stages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.module_stages (id, module_id, name, description, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: module_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.module_tasks (id, module_stage_id, name, description, priority, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modules (id, name, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: planning_base_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.planning_base_items (id, planning_base_id, name, description, project_idea, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: planning_bases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.planning_bases (id, name, description, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: project_checklist_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_checklist_items (id, project_id, title, description, is_completed, completed_at, completed_by, sort_order, category_key, created_at, updated_at) FROM stdin;
ce759d21-d6f9-4fae-97d2-6c3462a52c49	mO_cII7rQhZ8ZCOJUakgv	Objetivos definidos	\N	f	\N	\N	1	Geral	2026-03-20 20:33:09.626+00	2026-03-20 20:33:09.626+00
b6bdc17a-755e-4196-aefe-731d68930b2d	mO_cII7rQhZ8ZCOJUakgv	Equipe alocada	\N	f	\N	\N	2	Geral	2026-03-20 20:33:09.626+00	2026-03-20 20:33:09.626+00
edaedf3a-2a0d-4b4b-90ad-b2dbda83e082	mO_cII7rQhZ8ZCOJUakgv	Cronograma criado	\N	f	\N	\N	3	Geral	2026-03-20 20:33:09.626+00	2026-03-20 20:33:09.626+00
6b5ba713-62cc-4204-9f24-95dbf46fe863	mO_cII7rQhZ8ZCOJUakgv	Orçamento aprovado	\N	f	\N	\N	4	Geral	2026-03-20 20:33:09.626+00	2026-03-20 20:33:09.626+00
308ca561-f0bf-4627-9411-e84004e7da66	proj-sementes	Processos mapeados	\N	f	\N	\N	1	Preparação	2026-03-20 20:33:23.569+00	2026-03-20 20:33:23.569+00
054c782a-2052-48bc-b6d7-953c99ff2827	proj-sementes	Equipe treinada	\N	f	\N	\N	2	Preparação	2026-03-20 20:33:23.569+00	2026-03-20 20:33:23.569+00
5ea18b9a-08fa-4b76-980c-317c4943093c	proj-sementes	Ferramentas disponíveis	\N	f	\N	\N	3	Preparação	2026-03-20 20:33:23.569+00	2026-03-20 20:33:23.569+00
25fa8ade-164e-4566-9d2d-c2800e8f89ee	proj-sementes	Indicadores definidos	\N	f	\N	\N	4	Execução	2026-03-20 20:33:23.569+00	2026-03-20 20:33:23.569+00
b3689ce4-bfb6-432b-99e2-f0a6150c0202	proj-sementes	Rotina estabelecida	\N	f	\N	\N	5	Execução	2026-03-20 20:33:23.569+00	2026-03-20 20:33:23.569+00
3b2c31e7-193b-45c0-ba78-146aaf20e602	proj-sementes	Dashboard configurado	\N	f	\N	\N	6	Monitoramento	2026-03-20 20:33:23.569+00	2026-03-20 20:33:23.569+00
19eb6579-d378-4fe1-b003-ce7749f9c192	proj-sementes	Relatório periódico definido	\N	f	\N	\N	7	Monitoramento	2026-03-20 20:33:23.569+00	2026-03-20 20:33:23.569+00
d9c6de77-cd18-482e-ac66-0cbcc85ec4bd	proj-automacao	Requisitos levantados	\N	f	\N	\N	1	Análise	2026-03-20 20:33:24.968+00	2026-03-20 20:33:24.968+00
6ed06f39-577d-493b-8946-b4c66b98bb91	proj-automacao	Escopo definido	\N	f	\N	\N	2	Análise	2026-03-20 20:33:24.968+00	2026-03-20 20:33:24.968+00
6940a7e6-efd7-424c-a63c-65e597cf0572	proj-automacao	Cronograma aprovado	\N	f	\N	\N	3	Análise	2026-03-20 20:33:24.968+00	2026-03-20 20:33:24.968+00
fed99446-9caa-4086-944b-494c613dd038	proj-automacao	Recursos alocados	\N	f	\N	\N	4	Execução	2026-03-20 20:33:24.968+00	2026-03-20 20:33:24.968+00
67fd6444-0fbb-4f5f-b2a8-ddda4f0ad659	proj-automacao	Ambiente preparado	\N	f	\N	\N	5	Execução	2026-03-20 20:33:24.968+00	2026-03-20 20:33:24.968+00
08ca2001-5e56-41d8-bb14-4fa9bfddc300	proj-automacao	Testes planejados	\N	f	\N	\N	6	Execução	2026-03-20 20:33:24.968+00	2026-03-20 20:33:24.968+00
055e93aa-e23a-4c8a-9c11-db7d17fb62f7	proj-automacao	Documentação técnica pronta	\N	f	\N	\N	7	Entrega	2026-03-20 20:33:24.968+00	2026-03-20 20:33:24.968+00
121b9166-7139-4963-88f6-43ccb2cf7866	proj-automacao	Treinamento planejado	\N	f	\N	\N	8	Entrega	2026-03-20 20:33:24.968+00	2026-03-20 20:33:24.968+00
ded6a6ba-f517-4176-866b-69f79d1ff8e9	proj-automacao	Go-live agendado	\N	f	\N	\N	9	Entrega	2026-03-20 20:33:24.968+00	2026-03-20 20:33:24.968+00
a9afbf56-fbff-4900-a066-ab5ad0f7fbbd	proj-reforma	Projeto técnico aprovado	\N	f	\N	\N	1	Planejamento	2026-03-20 20:33:26.072+00	2026-03-20 20:33:26.072+00
f83f1241-8bc3-49e4-8324-3e7a93c79c52	proj-reforma	Licenças obtidas	\N	f	\N	\N	2	Planejamento	2026-03-20 20:33:26.072+00	2026-03-20 20:33:26.072+00
0fecf026-0bac-48be-a7ab-10ce41c3690f	proj-reforma	Orçamento validado	\N	f	\N	\N	3	Planejamento	2026-03-20 20:33:26.072+00	2026-03-20 20:33:26.072+00
ac0c62ea-0e72-4ee7-bd26-fc384b37d607	proj-reforma	Fornecedores selecionados	\N	f	\N	\N	4	Execução	2026-03-20 20:33:26.072+00	2026-03-20 20:33:26.072+00
b2642a33-239a-4953-8f20-864d6ef879de	proj-reforma	Materiais comprados	\N	f	\N	\N	5	Execução	2026-03-20 20:33:26.072+00	2026-03-20 20:33:26.072+00
9342bd5c-b229-4de4-b30a-8da6c9d27790	proj-reforma	Equipe técnica definida	\N	f	\N	\N	6	Execução	2026-03-20 20:33:26.072+00	2026-03-20 20:33:26.072+00
74d49fb5-f989-4cf8-8060-69a23c14a768	proj-reforma	Vistoria realizada	\N	f	\N	\N	7	Finalização	2026-03-20 20:33:26.072+00	2026-03-20 20:33:26.072+00
5060a5d2-b676-4f8d-b852-d16fa119cd4d	proj-reforma	Documentação as-built pronta	\N	f	\N	\N	8	Finalização	2026-03-20 20:33:26.072+00	2026-03-20 20:33:26.072+00
91ca58e7-9009-4312-bd5c-2261cd1eea72	proj-diamba	Fornecedores contratados	\N	f	\N	\N	2	Logística	2026-03-20 20:33:28.37+00	2026-03-20 20:33:28.37+00
69836771-4db0-49eb-bc42-70cfb2372731	proj-diamba	Equipamentos reservados	\N	f	\N	\N	3	Logística	2026-03-20 20:33:28.37+00	2026-03-20 20:33:28.37+00
abad8c98-3344-4efd-a4e8-95a225ccc741	proj-diamba	Transporte organizado	\N	f	\N	\N	4	Logística	2026-03-20 20:33:28.37+00	2026-03-20 20:33:28.37+00
45c4d17d-d143-4373-9631-5d0d678254c6	proj-diamba	Convites enviados	\N	f	\N	\N	5	Comunicação	2026-03-20 20:33:28.37+00	2026-03-20 20:33:28.37+00
75b110ef-d0b3-4cfb-879a-e805384b294f	proj-diamba	Divulgação realizada	\N	f	\N	\N	6	Comunicação	2026-03-20 20:33:28.37+00	2026-03-20 20:33:28.37+00
7522c29f-301a-48e5-876c-368e6d985c5f	proj-diamba	Material gráfico pronto	\N	f	\N	\N	7	Comunicação	2026-03-20 20:33:28.37+00	2026-03-20 20:33:28.37+00
b2949e12-da87-44f4-a5a4-bec399d5a3ff	proj-diamba	Cronograma do dia definido	\N	f	\N	\N	8	Operação	2026-03-20 20:33:28.37+00	2026-03-20 20:33:28.37+00
b7e7ed6c-1133-43e7-92a1-737a26a7b228	proj-diamba	Equipe briefada	\N	f	\N	\N	9	Operação	2026-03-20 20:33:28.37+00	2026-03-20 20:33:28.37+00
6382f26e-04d2-49c4-ae1c-5044206e1cc9	proj-diamba	Plano B definido	\N	f	\N	\N	10	Operação	2026-03-20 20:33:28.37+00	2026-03-20 20:33:28.37+00
21588a25-9daa-4c61-8ae6-ce8bb5122f9c	proj-diamba	Pesquisa de satisfação preparada	\N	f	\N	\N	11	Pós-evento	2026-03-20 20:33:28.37+00	2026-03-20 20:33:28.37+00
b948b3fa-7015-4001-896b-7bc760dd0103	proj-diamba	Relatório de resultados	\N	f	\N	\N	12	Pós-evento	2026-03-20 20:33:28.37+00	2026-03-20 20:33:28.37+00
9d3ef7d7-e6b5-44a2-b431-9f9ac0ae3a6a	proj-lab	Projeto técnico aprovado	\N	f	\N	\N	1	Planejamento	2026-03-20 20:33:29.853+00	2026-03-20 20:33:29.853+00
63f3a2f7-7462-449b-8d44-4aed3529437f	proj-lab	Licenças obtidas	\N	f	\N	\N	2	Planejamento	2026-03-20 20:33:29.853+00	2026-03-20 20:33:29.853+00
296870dc-bcad-4304-96b2-8790579f27e5	proj-lab	Orçamento validado	\N	f	\N	\N	3	Planejamento	2026-03-20 20:33:29.853+00	2026-03-20 20:33:29.853+00
3589af20-108b-4a95-af1d-52ed63384d26	proj-lab	Fornecedores selecionados	\N	f	\N	\N	4	Execução	2026-03-20 20:33:29.853+00	2026-03-20 20:33:29.853+00
0b10fe09-ca14-43f7-bb5c-028afd1a5b09	proj-lab	Materiais comprados	\N	f	\N	\N	5	Execução	2026-03-20 20:33:29.853+00	2026-03-20 20:33:29.853+00
1a99712d-4ed1-4183-b5ae-471fa3129c5e	proj-lab	Equipe técnica definida	\N	f	\N	\N	6	Execução	2026-03-20 20:33:29.853+00	2026-03-20 20:33:29.853+00
3402fe90-5374-4bc9-921a-4cecbd30f290	proj-lab	Vistoria realizada	\N	f	\N	\N	7	Finalização	2026-03-20 20:33:29.853+00	2026-03-20 20:33:29.853+00
81ff49a1-8e60-4711-bbda-243944c111df	proj-lab	Documentação as-built pronta	\N	f	\N	\N	8	Finalização	2026-03-20 20:33:29.853+00	2026-03-20 20:33:29.853+00
3fcac58c-b4fd-4ae0-b67a-628d9882d97d	proj-diamba	Local definido	\N	f	\N	\N	1	Logística	2026-03-20 20:33:28.37+00	2026-03-20 20:33:53.664+00
c1911fb7-aad7-4bc3-9f9d-b59399ecb1ec	jjHOHzKugVjNWcji3tosg	Local definido	\N	f	\N	\N	1	Logística	2026-03-21 03:22:31.705+00	2026-03-21 03:22:31.705+00
b654767e-5c74-4c14-8ba5-69e4fb852eaf	jjHOHzKugVjNWcji3tosg	Fornecedores contratados	\N	f	\N	\N	2	Logística	2026-03-21 03:22:31.705+00	2026-03-21 03:22:31.705+00
367d0fc0-6d88-44dc-b7b3-f4f566a8609d	jjHOHzKugVjNWcji3tosg	Equipamentos reservados	\N	f	\N	\N	3	Logística	2026-03-21 03:22:31.705+00	2026-03-21 03:22:31.705+00
a2c78e0d-8358-4a6a-9279-19916d8d9335	jjHOHzKugVjNWcji3tosg	Transporte organizado	\N	f	\N	\N	4	Logística	2026-03-21 03:22:31.705+00	2026-03-21 03:22:31.705+00
c4338a41-e05e-4851-935e-7d0c79bb12de	jjHOHzKugVjNWcji3tosg	Convites enviados	\N	f	\N	\N	5	Comunicação	2026-03-21 03:22:31.705+00	2026-03-21 03:22:31.705+00
ad7ee9b2-a0eb-411b-81be-606323ba82ba	jjHOHzKugVjNWcji3tosg	Divulgação realizada	\N	f	\N	\N	6	Comunicação	2026-03-21 03:22:31.705+00	2026-03-21 03:22:31.705+00
2da37c23-5c51-4c73-b1dc-5527c9ac6bea	jjHOHzKugVjNWcji3tosg	Material gráfico pronto	\N	f	\N	\N	7	Comunicação	2026-03-21 03:22:31.705+00	2026-03-21 03:22:31.705+00
fce9e3a2-688a-44e0-b9b1-ce98ec2f74d5	jjHOHzKugVjNWcji3tosg	Cronograma do dia definido	\N	f	\N	\N	8	Operação	2026-03-21 03:22:31.705+00	2026-03-21 03:22:31.705+00
621a63e1-c9ca-4846-95da-165f21ab05cd	jjHOHzKugVjNWcji3tosg	Equipe briefada	\N	f	\N	\N	9	Operação	2026-03-21 03:22:31.705+00	2026-03-21 03:22:31.705+00
cbf0220a-5da5-4952-8049-4f36f2d83548	jjHOHzKugVjNWcji3tosg	Plano B definido	\N	f	\N	\N	10	Operação	2026-03-21 03:22:31.705+00	2026-03-21 03:22:31.705+00
654cb1bc-521b-4380-8066-0538f2323e8c	jjHOHzKugVjNWcji3tosg	Pesquisa de satisfação preparada	\N	f	\N	\N	11	Pós-evento	2026-03-21 03:22:31.705+00	2026-03-21 03:22:31.705+00
b805c1d2-2675-4296-a98b-ba32d6673a4d	jjHOHzKugVjNWcji3tosg	Relatório de resultados	\N	f	\N	\N	12	Pós-evento	2026-03-21 03:22:31.705+00	2026-03-21 03:22:31.705+00
0a17b8a1-8afb-45b8-9985-0cef4e5f0a6d	Cal3gIEOcpVx2MeGGLvlJ	Processos mapeados	\N	f	\N	\N	1	Preparação	2026-03-21 03:25:07.865+00	2026-03-21 03:25:07.865+00
879e7a2c-37a8-4977-872a-9f27ebdb2fd8	Cal3gIEOcpVx2MeGGLvlJ	Equipe treinada	\N	f	\N	\N	2	Preparação	2026-03-21 03:25:07.865+00	2026-03-21 03:25:07.865+00
7747eed0-f420-4eaf-9abc-0bac8d93d27e	Cal3gIEOcpVx2MeGGLvlJ	Ferramentas disponíveis	\N	f	\N	\N	3	Preparação	2026-03-21 03:25:07.865+00	2026-03-21 03:25:07.865+00
0a7f62ac-da2c-4b65-af4b-cebb46f0a346	Cal3gIEOcpVx2MeGGLvlJ	Indicadores definidos	\N	f	\N	\N	4	Execução	2026-03-21 03:25:07.865+00	2026-03-21 03:25:07.865+00
454adfa9-0052-4329-9c4b-aaa5b94814f2	Cal3gIEOcpVx2MeGGLvlJ	Rotina estabelecida	\N	f	\N	\N	5	Execução	2026-03-21 03:25:07.865+00	2026-03-21 03:25:07.865+00
cd6a0033-c3f4-4c3b-a833-9f146ed444ed	Cal3gIEOcpVx2MeGGLvlJ	Dashboard configurado	\N	f	\N	\N	6	Monitoramento	2026-03-21 03:25:07.865+00	2026-03-21 03:25:07.865+00
c18122ba-c76a-4a3f-a68f-4079e369b040	Cal3gIEOcpVx2MeGGLvlJ	Relatório periódico definido	\N	f	\N	\N	7	Monitoramento	2026-03-21 03:25:07.865+00	2026-03-21 03:25:07.865+00
a19e7d92-db58-4179-b6b5-db8a5d0be0c7	dHAjDApevTvgt5ol9x6-Y	Recursos alocados	\N	f	\N	\N	4	Execução	2026-03-21 18:12:45.43+00	2026-03-21 18:12:45.43+00
5760e521-a3f3-4014-8473-f5f742d1a819	dHAjDApevTvgt5ol9x6-Y	Ambiente preparado	\N	f	\N	\N	5	Execução	2026-03-21 18:12:45.43+00	2026-03-21 18:12:45.43+00
d9a5c357-53da-4ade-89af-3c3daa7b1354	dHAjDApevTvgt5ol9x6-Y	Testes planejados	\N	f	\N	\N	6	Execução	2026-03-21 18:12:45.431+00	2026-03-21 18:12:45.431+00
2af22491-0efc-45db-99f6-bb7bb4128aef	dHAjDApevTvgt5ol9x6-Y	Requisitos levantados	\N	t	2026-03-21 18:30:47.46+00	membro-exemplo	1	Análise	2026-03-21 18:12:45.43+00	2026-03-21 18:30:47.46+00
5e865b43-d284-4d28-bf1e-314e7b25f220	dHAjDApevTvgt5ol9x6-Y	Cronograma aprovado	\N	t	2026-03-21 18:30:48.1+00	membro-exemplo	3	Análise	2026-03-21 18:12:45.43+00	2026-03-21 18:30:48.1+00
11788dfe-52d7-4221-bbd6-8ff8347e3744	dHAjDApevTvgt5ol9x6-Y	Escopo definido	\N	t	2026-03-21 18:30:49.052+00	membro-exemplo	2	Análise	2026-03-21 18:12:45.43+00	2026-03-21 18:30:49.052+00
7579798b-fca9-43e8-8ff4-941fcd5d50e9	dHAjDApevTvgt5ol9x6-Y	Treinamento planejado	\N	t	2026-03-21 18:30:51.818+00	membro-exemplo	8	Entrega	2026-03-21 18:12:45.431+00	2026-03-21 18:30:51.818+00
dee53c90-5186-4d7d-9fb9-2c5097851357	dHAjDApevTvgt5ol9x6-Y	Documentação técnica pronta	\N	t	2026-03-21 18:30:52.193+00	membro-exemplo	7	Entrega	2026-03-21 18:12:45.431+00	2026-03-21 18:30:52.193+00
75b09904-7af5-407a-a517-30c2e1bf924c	dHAjDApevTvgt5ol9x6-Y	Go-live agendado	\N	t	2026-03-21 18:31:46.021+00	membro-exemplo	9	Entrega	2026-03-21 18:12:45.431+00	2026-03-21 18:31:46.021+00
\.


--
-- Data for Name: project_stages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_stages (id, project_id, name, description, sort_order, status, start_date, end_date, created_at, updated_at, assigned_team_id) FROM stdin;
ec6hbVNe2BVtom7K8sAwI	mO_cII7rQhZ8ZCOJUakgv	Fase 0 — Decisões Estratégicas	\N	0	pending	2026-03-01 00:00:00+00	2026-03-13 00:00:00+00	2026-03-20 04:52:28.827892+00	2026-03-20 04:52:28.827892+00	\N
yCRTCtZkVqCpXCDD7Zjo9	RymFNMit610t-YkiEq1GI	Planejar	\N	0	pending	\N	\N	2026-03-21 02:33:00.363226+00	2026-03-21 02:33:00.363226+00	\N
r1qyxGyGgTv_dpUHhxbjy	RymFNMit610t-YkiEq1GI	Fazer	\N	0	pending	\N	\N	2026-03-21 02:33:00.389732+00	2026-03-21 02:33:00.389732+00	\N
iv_SWWYyv34KB4PjlXH5d	RymFNMit610t-YkiEq1GI	Finalizar	\N	0	pending	\N	\N	2026-03-21 02:33:00.408994+00	2026-03-21 02:33:00.408994+00	\N
dYm2jx50um63x6Dwrtc3e	80-8PjQ80dNKWVdL4Ydza	Planejar	\N	0	pending	\N	\N	2026-03-21 03:17:31.062964+00	2026-03-21 03:17:31.062964+00	\N
Cm1ZmiCoBpg9DQHqvJa6L	BNj9FcMOiVxgeHmgOxdlR	Organizacao	\N	0	pending	\N	\N	2026-03-21 03:34:57.948814+00	2026-03-21 03:34:57.948814+00	\N
2DCYm_a1sJQm6vsPxVoZ3	BNj9FcMOiVxgeHmgOxdlR	Infraestrutura	\N	0	pending	\N	\N	2026-03-21 03:34:57.970501+00	2026-03-21 03:34:57.970501+00	\N
-E7SkmN5mgoj4sglsp1fV	BNj9FcMOiVxgeHmgOxdlR	Logistica	\N	0	pending	\N	\N	2026-03-21 03:34:57.991299+00	2026-03-21 03:34:57.991299+00	\N
tA28PIpfJLJnW_oL9xZq1	BNj9FcMOiVxgeHmgOxdlR	Servicos Essenciais	\N	0	pending	\N	\N	2026-03-21 03:34:58.012487+00	2026-03-21 03:34:58.012487+00	\N
24mw0h3Yj8B1TR27gu_VW	BNj9FcMOiVxgeHmgOxdlR	Regularizacao	\N	0	pending	\N	\N	2026-03-21 03:34:58.033594+00	2026-03-21 03:34:58.033594+00	\N
kzg95BTaXD7xpvf0N9xYs	BNj9FcMOiVxgeHmgOxdlR	Inauguracao	\N	0	pending	\N	\N	2026-03-21 03:34:58.053434+00	2026-03-21 03:34:58.053434+00	\N
cdg-nL7vJcsv9M9lY8yWt	BNj9FcMOiVxgeHmgOxdlR	Pos-producao	\N	0	pending	\N	\N	2026-03-21 03:34:58.075029+00	2026-03-21 03:34:58.075029+00	\N
-SGhKyEyDmZ9HAkJ8aO4p	dHAjDApevTvgt5ol9x6-Y	PARTE UM - COMO FUNCIONA A ETAPA 	\N	0	in_progress	2026-03-21 00:00:00+00	2026-03-22 00:00:00+00	2026-03-21 18:21:54.94+00	2026-03-21 18:35:55.746+00	\N
backlog-stage-jjHOHzKugVjNWcji3tosg	jjHOHzKugVjNWcji3tosg	Backlog	\N	0	pending	\N	\N	2026-03-21 18:57:29.660332+00	2026-03-21 18:57:29.660332+00	\N
backlog-stage-mO_cII7rQhZ8ZCOJUakgv	mO_cII7rQhZ8ZCOJUakgv	Backlog	\N	0	pending	\N	\N	2026-03-21 18:57:29.660332+00	2026-03-21 18:57:29.660332+00	\N
fXAUrX92erOwAN5Fl1haN	Cal3gIEOcpVx2MeGGLvlJ	pré-mudança	\N	0	pending	\N	\N	2026-03-21 19:20:50.123+00	2026-03-21 19:20:50.123+00	\N
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, name, description, start_date, end_date, budget, status, created_at, updated_at, category, owner_id, priority, tags, initiative_id, assigned_team_id) FROM stdin;
proj-reforma	Reforma Estrutural da Sede	Reforma e adequação da sede principal	2026-02-01	2026-09-01	0.00	active	2026-03-20 01:09:31.96322+00	2026-03-21 04:16:39.201+00	infrastructure	uChin6OQDct_Z_VQIV1ae	high	{}	init-infraestrutura	\N
proj-automacao	Automatização de Rotinas	Automação de processos e rotinas operacionais	2026-01-15	2026-06-30	0.00	active	2026-03-20 01:09:31.96322+00	2026-03-20 01:09:31.96322+00	implementation	\N	medium	{}	init-tecnologia	\N
mO_cII7rQhZ8ZCOJUakgv	Febre de Arte 2026	\N	2026-03-01	2026-11-01	0.00	active	2026-03-20 04:52:28.80804+00	2026-03-20 04:52:28.80804+00	custom	\N	medium	{}	init-exemplo	\N
jjHOHzKugVjNWcji3tosg	Inauguração	Coffebreak com a equipe e convidados, formalização da missão e compromisso. 	2026-03-28	2026-03-28	500.00	active	2026-03-21 03:22:31.63+00	2026-03-21 03:22:31.63+00	event	membro-exemplo	low	\N	2WLlFQxMVbM0dOzYksHmc	\N
Cal3gIEOcpVx2MeGGLvlJ	Adequações, reforma e melhorias	O que deve mudar até o dia da mudança para a equipe ficar confortável?	2026-03-21	2026-03-27	4000.00	active	2026-03-21 03:25:07.822+00	2026-03-21 03:25:07.822+00	operational	WuvgBttO_q5f5gTOWONH6	medium	\N	2WLlFQxMVbM0dOzYksHmc	\N
proj-lab	Inauguração do Laboratório	Planejamento e inauguração do laboratório de análises	2026-03-01	2026-08-01	0.00	active	2026-03-20 01:09:31.96322+00	2026-03-21 04:15:32.13+00	event	WuvgBttO_q5f5gTOWONH6	high	{}	init-infraestrutura	\N
proj-sementes	Banco de Sementes Estável	Criação e manutenção de banco de sementes	2026-02-01	2026-12-31	0.00	active	2026-03-20 01:09:31.96322+00	2026-03-21 04:16:09.6+00	strategic	mem-tonio	medium	{}	init-infraestrutura	\N
proj-diamba	Diamba 2026	Projeto Diamba 2026	2026-04-03	2026-04-04	0.00	active	2026-03-20 01:09:31.96322+00	2026-03-21 04:17:14.995+00	event	\N	medium	{}	init-infraestrutura	\N
dHAjDApevTvgt5ol9x6-Y	UMA CADEIA COMPLETA	esse é um projeto que visa testar a cadeia de ponta a ponta.	2026-03-21	2026-03-21	500.00	active	2026-03-21 18:12:45.348+00	2026-03-21 18:12:45.348+00	implementation	membro-exemplo	critical	\N	zNIBcetH24aAahz3t-cKm	\N
RymFNMit610t-YkiEq1GI	[MODELO] Organização Básica	\N	2026-03-21	\N	0.00	active	2026-03-21 02:33:00.326958+00	2026-03-21 02:33:00.326958+00	custom	\N	medium	{}	backlog-initiative	\N
80-8PjQ80dNKWVdL4Ydza	[MODULO] Organizacao	\N	2026-03-21	\N	0.00	active	2026-03-21 03:17:31.003768+00	2026-03-21 03:17:31.003768+00	custom	\N	medium	{}	backlog-initiative	\N
BNj9FcMOiVxgeHmgOxdlR	[MODULO] Mudanca + Inauguracao Adapta	\N	2026-03-21	\N	0.00	active	2026-03-21 03:34:57.920826+00	2026-03-21 04:03:49.754+00	custom	\N	high	{}	backlog-initiative	\N
\.


--
-- Data for Name: sector_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sector_members (id, sector_id, member_id, role, created_at, permissions) FROM stdin;
9vXA3zraQqWAX1aHLkeTd	Q13Y4dK-iRUroTASW7mCc	membro-exemplo	responsavel	2026-03-19 15:32:53.878+00	{}
c222287f-44bc-4f69-8cf4-90a0e0918ca0	_t2mzgj0UHQqaVx8GD_LU	uChin6OQDct_Z_VQIV1ae	responsavel	2026-03-19 19:27:55.898+00	{}
cd5e8de9-7e48-4aa2-a602-6f6ae364dda6	GPb-Lz-I0gwqx-Guwti0y	WuvgBttO_q5f5gTOWONH6	responsavel	2026-03-19 19:28:15.431+00	{}
sm-tonio-cultivo	EB1iiNBWWwimHKWxVs-v4	mem-tonio	responsavel	2026-03-20 01:09:17.308911+00	{}
sm-edson-cultivo	EB1iiNBWWwimHKWxVs-v4	mem-edson	agente	2026-03-20 01:09:17.308911+00	{}
sm-jeff-cultivo	EB1iiNBWWwimHKWxVs-v4	mem-jeff	agente	2026-03-20 01:09:17.308911+00	{}
sm-murga-com	Q13Y4dK-iRUroTASW7mCc	DA2Fnd_vCiWJvvGhDCnPd	agente	2026-03-20 01:09:17.308911+00	{}
sm-giulia-com	Q13Y4dK-iRUroTASW7mCc	yliIb-3yRFUatWeRn1C4S	agente	2026-03-20 01:09:17.308911+00	{}
sm-rebeca-com	Q13Y4dK-iRUroTASW7mCc	dxC9AIsVY9-rMR9WcfXCR	agente	2026-03-20 01:09:17.308911+00	{}
sm-clara-acol	HOdubaBeRyhT4T-iqJiO7	mem-clara	agente	2026-03-20 01:09:17.308911+00	{}
sm-thiago-acol	HOdubaBeRyhT4T-iqJiO7	mem-thiago	agente	2026-03-20 01:09:17.308911+00	{}
sm-manu-exp	_drAcc69pmYACJHTc3XSF	mem-manu	agente	2026-03-20 01:09:17.308911+00	{}
sm-brena-exp	_drAcc69pmYACJHTc3XSF	mem-brena	agente	2026-03-20 01:09:17.308911+00	{}
sm-pedro-trima	7Jm8g_VV0YQHlVU5e3qZ_	mem-pedro	agente	2026-03-20 01:09:17.308911+00	{}
sm-jv-trima	7Jm8g_VV0YQHlVU5e3qZ_	mem-joaovictor	agente	2026-03-20 01:09:17.308911+00	{}
sm-gabriel-trima	7Jm8g_VV0YQHlVU5e3qZ_	mem-gabriel-t	agente	2026-03-20 01:09:17.308911+00	{}
\.


--
-- Data for Name: sectors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sectors (id, name, description, created_at, updated_at) FROM stdin;
Q13Y4dK-iRUroTASW7mCc	Comunicação	Esse setor zela pela boa comunicação, interna e externa, da Associação. Aqui, se reúnem as iniciativas do time de Comunicação. 	2026-03-19 15:31:01.703+00	2026-03-19 15:33:03.079+00
EB1iiNBWWwimHKWxVs-v4	Cultivo		2026-03-19 18:02:42.628+00	2026-03-19 18:02:42.628+00
_t2mzgj0UHQqaVx8GD_LU	Financeiro		2026-03-19 18:02:57.894+00	2026-03-19 18:02:57.894+00
HOdubaBeRyhT4T-iqJiO7	Acolhimento		2026-03-19 18:03:06.779+00	2026-03-19 18:03:06.779+00
_drAcc69pmYACJHTc3XSF	Expedição		2026-03-19 18:03:12.329+00	2026-03-19 18:03:12.329+00
7Jm8g_VV0YQHlVU5e3qZ_	Trima		2026-03-19 18:03:16.674+00	2026-03-19 18:03:16.674+00
GPb-Lz-I0gwqx-Guwti0y	Núcleo Terapêutico		2026-03-19 18:03:31.775+00	2026-03-19 18:03:31.775+00
sec-laboratorio	Laboratório	Laboratório de análises e pesquisa	2026-03-20 01:08:37.221008+00	2026-03-20 01:08:37.221008+00
677e1eee-b038-4eda-9c19-d893346723e6	Todos	Representa todos os setores	2026-03-21 04:51:36.451455+00	2026-03-21 04:51:36.451455+00
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, created_at, last_accessed, expires_at) FROM stdin;
2f0082921d9791d289c0a6f83ce3453eba77c13ed22a1c812f3fb9970cce16b2	1	2026-03-19 00:39:37.223+00	2026-03-19 00:39:37.223+00	2026-03-26 00:39:37.223+00
c8c3ff576d7d05e3d3a7e54439c4a0d67968b1b59b15ecd3820e2d4b2ab72a81	1	2026-03-19 00:39:47.423+00	2026-03-19 00:39:48.219+00	2026-03-26 00:39:47.423+00
64546c8bcb58253b6407e111589b17fb0e1e9197b33f434a1d16d87886177b97	1	2026-03-19 00:44:45.086+00	2026-03-19 00:44:45.086+00	2026-03-26 00:44:45.086+00
d81cfb0511e6df1afc93ee3ccaefb838e8961971e1d05e963066c97e580dcbbf	1	2026-03-20 13:20:35.986+00	2026-03-20 20:39:02.986+00	2026-03-27 13:20:35.986+00
f393ddfe69fd0d18a79c998a2fc1943108f7df51b38c85d0acc213a4a541f09d	1	2026-03-19 00:46:04.408+00	2026-03-22 03:31:18.668+00	2026-03-26 00:46:04.408+00
39867d4ec462da172e135ff2346a84d9e30951c3e688aaa378f894e2944c5c1f	1	2026-03-21 14:32:21.563+00	2026-03-21 15:19:21.479+00	2026-03-28 14:32:21.563+00
\.


--
-- Data for Name: task_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_actions (id, task_id, type, title, description, requested_by, assigned_to, status, due_date, completed_at, created_at, updated_at, operator_id, estimated_hours, actual_hours) FROM stdin;
GN96EM3TTscr_MBwfhn1E	1HAzv9LkaNqDbpzW5bM70	review	Avaliar resultados da edição anterior	Levantar métricas e feedbacks	\N	\N	pending	\N	\N	2026-03-19 22:30:05.084+00	2026-03-19 22:30:05.243596+00	\N	4	\N
gcQIHuEdWdYgndkyjfXIO	1HAzv9LkaNqDbpzW5bM70	review	Ouvir expositores	Pesquisa/reunião com expositores	\N	\N	pending	\N	\N	2026-03-19 22:30:05.084+00	2026-03-19 22:30:05.243596+00	\N	3	\N
PBm60pyw_Ph-ETVrN55nM	1HAzv9LkaNqDbpzW5bM70	review	Ouvir público	Pesquisa com público	\N	\N	pending	\N	\N	2026-03-19 22:30:05.084+00	2026-03-19 22:30:05.243596+00	\N	3	\N
no1G8yfbYc9SJ1z3xdHld	1HAzv9LkaNqDbpzW5bM70	approve	Definir posicionamento da edição 2	Decidir modelo final	\N	\N	pending	2026-03-15 00:00:00+00	\N	2026-03-19 22:30:05.084+00	2026-03-19 22:30:05.243596+00	\N	2	\N
L_Xjwb691CO6xBctqE_B8	JcgRirn59WZTvzGbHZcvh	custom	Analisar dados financeiros	\N	\N	\N	pending	2026-03-01 00:00:00+00	\N	2026-03-20 04:52:28.898721+00	2026-03-20 04:52:28.898721+00	\N	\N	\N
DyJlcpHGGCCc4-eCfOddL	JcgRirn59WZTvzGbHZcvh	custom	Consolidar aprendizados	\N	\N	\N	pending	2026-03-02 00:00:00+00	\N	2026-03-20 04:52:28.914832+00	2026-03-20 04:52:28.914832+00	\N	\N	\N
qNPkhs4z2wzpYssRgZOdw	KiLzqbWREKNTUfqoLq2nC	custom	Comparar cenários	\N	\N	\N	pending	2026-03-05 00:00:00+00	\N	2026-03-20 04:52:28.930225+00	2026-03-20 04:52:28.930225+00	\N	\N	\N
B_FffQU8VuYAs1YsWdTyG	KiLzqbWREKNTUfqoLq2nC	custom	Decidir posicionamento	\N	\N	\N	pending	2026-03-06 00:00:00+00	\N	2026-03-20 04:52:28.94483+00	2026-03-20 04:52:28.94483+00	\N	\N	\N
i7sTGfLtKIZqCeI6wLNGH	xW4qR-R8ETP6LkCmGJfQz	custom	Mapear locais	\N	\N	\N	pending	2026-03-05 00:00:00+00	\N	2026-03-20 04:52:28.960461+00	2026-03-20 04:52:28.960461+00	\N	\N	\N
u05miCNriJ6T2JahqjGXm	xW4qR-R8ETP6LkCmGJfQz	custom	Comparar custos	\N	\N	\N	pending	2026-03-08 00:00:00+00	\N	2026-03-20 04:52:28.976891+00	2026-03-20 04:52:28.976891+00	\N	\N	\N
PlFwgMJAvw51MiepHOXav	xW4qR-R8ETP6LkCmGJfQz	custom	Negociar espaço	\N	\N	\N	pending	2026-03-09 00:00:00+00	\N	2026-03-20 04:52:28.993199+00	2026-03-20 04:52:28.993199+00	\N	\N	\N
usM2lsxwBIVVI9ZDVsnTL	lL3KKrNY7VDj5rQWY_bEo	review	Revisar o funcionamento a partir dessa ação teste.	\N	\N	membro-exemplo	pending	2026-03-21 03:00:00+00	\N	2026-03-21 18:31:25.648+00	2026-03-21 18:31:25.72311+00	\N	\N	\N
\.


--
-- Data for Name: task_checklist_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_checklist_items (id, task_id, category_key, title, description, is_completed, completed_by, completed_at, sort_order, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: task_dependencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_dependencies (id, task_id, depends_on_task_id, dependency_type, created_at) FROM stdin;
\.


--
-- Data for Name: task_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_participants (id, task_id, member_id, role, created_at) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, project_id, assignee_id, name, status, priority, start_date, end_date, progress, created_at, updated_at, stage_id, assigned_team_id, shift) FROM stdin;
4yhRAcC_Xn_8_HTjI1_Eg	RymFNMit610t-YkiEq1GI	\N	Definir objetivo	open	high	\N	\N	0	2026-03-21 02:33:00.433309+00	2026-03-21 02:33:00.433309+00	yCRTCtZkVqCpXCDD7Zjo9	\N	morning
UUlpuZxJuQFvP1kuaU96g	RymFNMit610t-YkiEq1GI	\N	Definir responsáveis	open	medium	\N	\N	0	2026-03-21 02:33:00.461565+00	2026-03-21 02:33:00.461565+00	yCRTCtZkVqCpXCDD7Zjo9	\N	morning
Qu9Tx1Z2J4tV17uH8-dPz	RymFNMit610t-YkiEq1GI	\N	Executar atividade	open	high	\N	\N	0	2026-03-21 02:33:00.486945+00	2026-03-21 02:33:00.486945+00	r1qyxGyGgTv_dpUHhxbjy	\N	morning
G1IPRWnvjWbv4HUJVPJ6a	RymFNMit610t-YkiEq1GI	\N	Registrar resultado	open	medium	\N	\N	0	2026-03-21 02:33:00.514867+00	2026-03-21 02:33:00.514867+00	iv_SWWYyv34KB4PjlXH5d	\N	morning
CB-frDiTJ2t2Ir3Ddp-IV	80-8PjQ80dNKWVdL4Ydza	\N	Definir objetivo	open	high	\N	\N	0	2026-03-21 03:17:31.103752+00	2026-03-21 03:17:31.103752+00	dYm2jx50um63x6Dwrtc3e	\N	morning
t0psS_sKMqnl3i8qAQfIf	80-8PjQ80dNKWVdL4Ydza	\N	Definir escopo	open	medium	\N	\N	0	2026-03-21 03:17:31.149547+00	2026-03-21 03:17:31.149547+00	dYm2jx50um63x6Dwrtc3e	\N	morning
74ySZ6bhuA0ugVkUp0vCx	80-8PjQ80dNKWVdL4Ydza	\N	Definir responsáveis	open	medium	\N	\N	0	2026-03-21 03:17:31.204235+00	2026-03-21 03:17:31.204235+00	dYm2jx50um63x6Dwrtc3e	\N	morning
sMM46xU1PiqNYjFj7A7Yd	80-8PjQ80dNKWVdL4Ydza	\N	Definir prazo	open	medium	\N	\N	0	2026-03-21 03:17:31.24039+00	2026-03-21 03:17:31.24039+00	dYm2jx50um63x6Dwrtc3e	\N	morning
lL3KKrNY7VDj5rQWY_bEo	dHAjDApevTvgt5ol9x6-Y	membro-exemplo	Testar o sistema de cabo a cabo	in_progress	medium	2026-03-21	2026-03-21	15	2026-03-21 18:25:28.673+00	2026-03-21 18:43:24.496+00	-SGhKyEyDmZ9HAkJ8aO4p	\N	morning
0vSThrcnu9AloYVyjQOf7	jjHOHzKugVjNWcji3tosg	\N	Registrar resultado	open	medium	\N	\N	0	2026-03-21 03:28:17.186+00	2026-03-21 03:28:17.218376+00	backlog-stage-jjHOHzKugVjNWcji3tosg	\N	morning
RyN7OoMBAjN2X_yoVRbxu	jjHOHzKugVjNWcji3tosg	\N	Executar atividade	open	high	\N	\N	0	2026-03-21 03:28:17.186+00	2026-03-21 03:28:17.218376+00	backlog-stage-jjHOHzKugVjNWcji3tosg	\N	morning
-dAGQcelWb080ucSKv06A	mO_cII7rQhZ8ZCOJUakgv	\N	teste	open	medium	2026-02-21	2026-03-04	0	2026-03-20 19:45:55.103+00	2026-03-21 14:50:17.256+00	backlog-stage-mO_cII7rQhZ8ZCOJUakgv	\N	morning
78IXTP87dovZH4GIHO5jt	dHAjDApevTvgt5ol9x6-Y	membro-exemplo	teste2	open	medium	2026-03-21	2026-03-21	0	2026-03-21 20:51:53.822+00	2026-03-21 20:51:53.870896+00	-SGhKyEyDmZ9HAkJ8aO4p	\N	morning
ij9f3J7Zf4lekHu76FS3u	BNj9FcMOiVxgeHmgOxdlR	\N	Confirmar data da inauguracao	open	high	\N	\N	0	2026-03-21 03:34:58.138462+00	2026-03-21 03:34:58.138462+00	Cm1ZmiCoBpg9DQHqvJa6L	\N	morning
KtZUqytyfFUuzmsmUJpzV	BNj9FcMOiVxgeHmgOxdlR	WuvgBttO_q5f5gTOWONH6	Contratar pedreiro (diaria)	open	high	\N	\N	0	2026-03-21 03:34:58.166303+00	2026-03-21 03:34:58.166303+00	2DCYm_a1sJQm6vsPxVoZ3	\N	morning
dY4_urTLWOR4B0QgHZu-1	BNj9FcMOiVxgeHmgOxdlR	WuvgBttO_q5f5gTOWONH6	Executar pequenos reparos	open	high	\N	\N	0	2026-03-21 03:34:58.193185+00	2026-03-21 03:34:58.193185+00	2DCYm_a1sJQm6vsPxVoZ3	\N	morning
fvIMpMLpSXdBl31eLtyZ0	BNj9FcMOiVxgeHmgOxdlR	WuvgBttO_q5f5gTOWONH6	Contratar faxina	open	high	\N	\N	0	2026-03-21 03:34:58.217343+00	2026-03-21 03:34:58.217343+00	2DCYm_a1sJQm6vsPxVoZ3	\N	morning
oLFL1z8WqISduY9H3ggQQ	BNj9FcMOiVxgeHmgOxdlR	WuvgBttO_q5f5gTOWONH6	Realizar limpeza geral	open	high	\N	\N	0	2026-03-21 03:34:58.242906+00	2026-03-21 03:34:58.242906+00	2DCYm_a1sJQm6vsPxVoZ3	\N	morning
GEo85cDIjUQT2hNNGSYGv	BNj9FcMOiVxgeHmgOxdlR	WuvgBttO_q5f5gTOWONH6	Organizar transporte de moveis	open	high	\N	\N	0	2026-03-21 03:34:58.265913+00	2026-03-21 03:34:58.265913+00	-E7SkmN5mgoj4sglsp1fV	\N	morning
J1IavhoWpj_Bo4ouRlWPx	BNj9FcMOiVxgeHmgOxdlR	WuvgBttO_q5f5gTOWONH6	Mover computadores e equipamentos	open	high	\N	\N	0	2026-03-21 03:34:58.293147+00	2026-03-21 03:34:58.293147+00	-E7SkmN5mgoj4sglsp1fV	\N	morning
9A-ZTabMAFUSIcIYGhYdV	BNj9FcMOiVxgeHmgOxdlR	WuvgBttO_q5f5gTOWONH6	Instalar equipamentos no novo espaco	open	high	\N	\N	0	2026-03-21 03:34:58.319386+00	2026-03-21 03:34:58.319386+00	-E7SkmN5mgoj4sglsp1fV	\N	morning
r8LTHRW654hrGafK1rcny	BNj9FcMOiVxgeHmgOxdlR	WuvgBttO_q5f5gTOWONH6	Instalar internet	open	high	\N	\N	0	2026-03-21 03:34:58.346482+00	2026-03-21 03:34:58.346482+00	tA28PIpfJLJnW_oL9xZq1	\N	morning
Z3W5q84sDO9qDMZmPl8y7	BNj9FcMOiVxgeHmgOxdlR	uChin6OQDct_Z_VQIV1ae	Regularizar energia (luz)	open	high	\N	\N	0	2026-03-21 03:34:58.376518+00	2026-03-21 03:34:58.376518+00	tA28PIpfJLJnW_oL9xZq1	\N	morning
Kn7CGIAes5uc1FxjvZVkO	BNj9FcMOiVxgeHmgOxdlR	uChin6OQDct_Z_VQIV1ae	Regularizar agua	open	high	\N	\N	0	2026-03-21 03:34:58.408161+00	2026-03-21 03:34:58.408161+00	tA28PIpfJLJnW_oL9xZq1	\N	morning
6XL2duCHIstwp3x6-CHmu	BNj9FcMOiVxgeHmgOxdlR	uChin6OQDct_Z_VQIV1ae	Atualizar endereco nos orgaos	open	high	\N	\N	0	2026-03-21 03:34:58.43719+00	2026-03-21 03:34:58.43719+00	24mw0h3Yj8B1TR27gu_VW	\N	morning
xW4qR-R8ETP6LkCmGJfQz	mO_cII7rQhZ8ZCOJUakgv	\N	Definir local do evento	open	medium	2026-06-05	2026-06-16	0	2026-03-20 04:52:28.882453+00	2026-03-20 16:57:14.284+00	ec6hbVNe2BVtom7K8sAwI	\N	morning
SKmFS7UpyVG8pOE8g8MGv	BNj9FcMOiVxgeHmgOxdlR	uChin6OQDct_Z_VQIV1ae	Atualizar dados cadastrais da Adapta	open	high	\N	\N	0	2026-03-21 03:34:58.466513+00	2026-03-21 03:34:58.466513+00	24mw0h3Yj8B1TR27gu_VW	\N	morning
KiLzqbWREKNTUfqoLq2nC	mO_cII7rQhZ8ZCOJUakgv	\N	Definir modelo do evento	open	medium	2026-03-02	2026-03-05	0	2026-03-20 04:52:28.866207+00	2026-03-20 17:34:57.945+00	ec6hbVNe2BVtom7K8sAwI	\N	morning
aJBPQTGlgTw6yioCUCIti	BNj9FcMOiVxgeHmgOxdlR	\N	Planejar coffe break	open	high	\N	\N	0	2026-03-21 03:34:58.50157+00	2026-03-21 03:34:58.50157+00	kzg95BTaXD7xpvf0N9xYs	\N	morning
7d6Rpa2DFJgoRXSavPMa2	BNj9FcMOiVxgeHmgOxdlR	\N	Definir lista de convidados	open	medium	\N	\N	0	2026-03-21 03:34:58.532469+00	2026-03-21 03:34:58.532469+00	kzg95BTaXD7xpvf0N9xYs	\N	morning
cqR6hNcI7MMr7rwZgX5KM	BNj9FcMOiVxgeHmgOxdlR	\N	Organizar alimentos e bebidas	open	high	\N	\N	0	2026-03-21 03:34:58.557764+00	2026-03-21 03:34:58.557764+00	kzg95BTaXD7xpvf0N9xYs	\N	morning
1HAzv9LkaNqDbpzW5bM70	mO_cII7rQhZ8ZCOJUakgv	\N	Modelo do evento	open	high	2026-04-20	2026-06-14	0	2026-03-19 22:30:05.084+00	2026-03-20 19:33:34.822+00	ec6hbVNe2BVtom7K8sAwI	\N	night
cWwWNnkryvOPCFvVs2_n7	BNj9FcMOiVxgeHmgOxdlR	\N	Definir plano da mudança	open	high	\N	\N	0	2026-03-21 03:34:58.10563+00	2026-03-21 03:34:58.10563+00	Cm1ZmiCoBpg9DQHqvJa6L	\N	morning
5Avr7l_Xdt66SqTQd1Azg	BNj9FcMOiVxgeHmgOxdlR	\N	Preparar espaco para recepcao	open	high	\N	\N	0	2026-03-21 03:34:58.585173+00	2026-03-21 03:34:58.585173+00	kzg95BTaXD7xpvf0N9xYs	\N	morning
04fwTFSrAKjEDHIh0GRsp	BNj9FcMOiVxgeHmgOxdlR	\N	Receber convidados	open	medium	\N	\N	0	2026-03-21 03:34:58.610936+00	2026-03-21 03:34:58.610936+00	kzg95BTaXD7xpvf0N9xYs	\N	morning
zsW5Wbs5l0KcT80PRf29_	BNj9FcMOiVxgeHmgOxdlR	\N	Organizar espaco apos inauguracao	open	medium	\N	\N	0	2026-03-21 03:34:58.637456+00	2026-03-21 03:34:58.637456+00	cdg-nL7vJcsv9M9lY8yWt	\N	morning
f1l8E9hFQD_4HTougUE4-	BNj9FcMOiVxgeHmgOxdlR	\N	Ajustar pendencias finais	open	medium	\N	\N	0	2026-03-21 03:34:58.665563+00	2026-03-21 03:34:58.665563+00	cdg-nL7vJcsv9M9lY8yWt	\N	morning
mmrMN7CKecWdP34n623BY	jjHOHzKugVjNWcji3tosg	\N	Definir prazo	open	medium	\N	\N	0	2026-03-21 03:28:02.717+00	2026-03-21 03:28:02.754479+00	backlog-stage-jjHOHzKugVjNWcji3tosg	\N	morning
xqyk8YTQvoSIawiwxQLfB	jjHOHzKugVjNWcji3tosg	\N	Definir responsáveis	open	medium	\N	\N	0	2026-03-21 03:28:02.717+00	2026-03-21 03:28:02.754479+00	backlog-stage-jjHOHzKugVjNWcji3tosg	\N	morning
CvU3tNFzInYn3AL74XYjw	jjHOHzKugVjNWcji3tosg	\N	Definir escopo	open	medium	\N	\N	0	2026-03-21 03:28:02.717+00	2026-03-21 03:28:02.754479+00	backlog-stage-jjHOHzKugVjNWcji3tosg	\N	morning
8gOrw66GVmZt6aw7oQy0G	jjHOHzKugVjNWcji3tosg	\N	Definir objetivo	open	high	\N	\N	0	2026-03-21 03:28:02.717+00	2026-03-21 03:28:02.754479+00	backlog-stage-jjHOHzKugVjNWcji3tosg	\N	morning
JcgRirn59WZTvzGbHZcvh	mO_cII7rQhZ8ZCOJUakgv	\N	Avaliar resultados da edição anterior	open	medium	2026-03-02	2026-03-05	0	2026-03-20 04:52:28.847525+00	2026-03-21 20:52:34.983+00	ec6hbVNe2BVtom7K8sAwI	\N	morning
\.


--
-- Data for Name: team_group_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_group_members (id, team_id, member_id, created_at) FROM stdin;
OYGGuhS3XJnCQo9zxYA_k	TCyKmAbJHVgPfhBAIQKOw	membro-exemplo	2026-03-19 18:43:28.811+00
5dg99Mq9ndJn-Bgw6ICcU	TCyKmAbJHVgPfhBAIQKOw	yliIb-3yRFUatWeRn1C4S	2026-03-19 18:43:32.581+00
tgm-rebeca-jur	haUDQydLrJ6fh0OQqupO6	mem-dra-rebeca	2026-03-20 01:54:11.281457+00
S5OLMZr1e1QOOh_hL6kdi	haUDQydLrJ6fh0OQqupO6	mem-dr-italo	2026-03-20 02:04:56.894+00
IL7X9msxqRhHTI9tEte8G	TCyKmAbJHVgPfhBAIQKOw	mem-dr-italo	2026-03-20 02:04:56.898+00
yYyDfnifr0f-j56jmh4Is	team-contabil	uChin6OQDct_Z_VQIV1ae	2026-03-20 04:10:38.471+00
HuEToTZR51zaDWvyZ4N_f	TCyKmAbJHVgPfhBAIQKOw	uChin6OQDct_Z_VQIV1ae	2026-03-20 04:10:38.886+00
enEhmxiNoslDmJuxj7Buz	team-tecnologia	uChin6OQDct_Z_VQIV1ae	2026-03-20 04:10:55.312+00
Js7FtEwWEd2zKWzkOKoha	team-tecnologia	WuvgBttO_q5f5gTOWONH6	2026-03-20 04:10:59.202+00
VrzEcVIM0886ZLtqxlq09	TCyKmAbJHVgPfhBAIQKOw	WuvgBttO_q5f5gTOWONH6	2026-03-20 04:10:59.722+00
5Xz_v84STHYR0rSNo-g44	team-tecnologia	membro-exemplo	2026-03-20 04:11:04.695+00
1XbmgDHFrRhMoJEqWaIFH	team-contabil	nVq5NE73JzN9et__-h6ki	2026-03-20 13:47:28.1+00
vc7TBmCM0rcl4dd2y-q1_	TCyKmAbJHVgPfhBAIQKOw	mem-gabriel-t	2026-03-20 13:53:55.351+00
w6AwPT_BaJDaWuM37DMhh	TCyKmAbJHVgPfhBAIQKOw	mem-clara	2026-03-20 14:01:29.253+00
NfNDK-d3K1q1YwkQVqnAm	WDZVrIVDjLH5LFuHVfAn2	mem-clara	2026-03-20 14:01:29.287+00
R1PM1hoJMyItQNPZrQHSO	WDZVrIVDjLH5LFuHVfAn2	mem-manu	2026-03-20 14:59:31.445+00
W6LG_WYHToFUfAsZZN6gw	TCyKmAbJHVgPfhBAIQKOw	mem-manu	2026-03-20 14:59:31.895+00
uwLEUbjSxYl7Tqvzzl-ii	WDZVrIVDjLH5LFuHVfAn2	mem-gabriel-t	2026-03-21 14:47:03.486+00
3NqwGABY8FyHURXO28FUC	WDZVrIVDjLH5LFuHVfAn2	mem-joaovictor	2026-03-21 14:47:18.833+00
oAz70SicAI_rJ0ligd-bo	TCyKmAbJHVgPfhBAIQKOw	mem-joaovictor	2026-03-21 14:47:18.838+00
O1LskFqAgCteKFvdy6HzZ	WDZVrIVDjLH5LFuHVfAn2	mem-edson	2026-03-21 14:47:24.1+00
NxErVCWCFSDiTpAB36ZzL	TCyKmAbJHVgPfhBAIQKOw	mem-edson	2026-03-21 14:47:24.419+00
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_members (id, name, role, initials, capacity_hours, created_at, user_id, email, status, employment_type, full_name, nickname, phone) FROM stdin;
WuvgBttO_q5f5gTOWONH6	Isabela Dias	Diretora Núcleo Terapêutico	ID	40.0	2026-03-19 19:28:15.424585+00	\N	isabelaluiza@gmail.com	active	clt	Isabela Luiza Dias Fernandes	isabelaluiza	\N
uChin6OQDct_Z_VQIV1ae	Oton Borges	Diretor Financeiro	OB	40.0	2026-03-19 19:27:08.709784+00	\N	oton.bcf@gmail.com	active	clt	Oton Borges	oton.bcf	\N
membro-exemplo	Gabriela Dias Fernandes	Diretora Adj. Núcleo Comunicação	GD	40.0	2026-03-19 15:00:20.504877+00	1	gabriela92dias@gmail.com	active	clt	Gabriela Dias Fernandes	\N	\N
DA2Fnd_vCiWJvvGhDCnPd	Gabriel Murga	Agente de Comunicação	GM	15.0	2026-03-19 19:24:28.174+00	\N	\N	active	contract_service	\N	Murga	\N
yliIb-3yRFUatWeRn1C4S	Giulia Meurer	Designer / Agente de Comunicação	GM	15.0	2026-03-19 17:32:03.289+00	\N	\N	active	clt	\N	\N	\N
dxC9AIsVY9-rMR9WcfXCR	Rebeca Rosa	Agente de Comunicação	RR	15.0	2026-03-19 19:26:28.608+00	\N	\N	active	contract_service	\N	\N	\N
mem-tonio	Tonio Roeder	Presidente / Chefe de Cultivo	TR	40.0	2026-03-20 01:08:29.723825+00	\N	\N	active	clt	Tonio Roeder	\N	\N
mem-edson	Edson	Operador de Cultivo	ED	40.0	2026-03-20 01:08:29.723825+00	\N	\N	pending_registration	clt	\N	\N	\N
mem-jeff	Jeff	Operador de Cultivo	JF	40.0	2026-03-20 01:08:29.723825+00	\N	\N	pending_registration	clt	\N	\N	\N
mem-clara	Clara	Agente de Acolhimento	CL	40.0	2026-03-20 01:08:29.723825+00	\N	\N	pending_registration	clt	\N	\N	\N
mem-thiago	Thiago	Agente de Acolhimento	TH	40.0	2026-03-20 01:08:29.723825+00	\N	\N	pending_registration	clt	\N	\N	\N
mem-manu	Manu	Agente de Expedição	MN	40.0	2026-03-20 01:08:29.723825+00	\N	\N	pending_registration	clt	\N	\N	\N
mem-brena	Brena	Agente de Expedição	BR	40.0	2026-03-20 01:08:29.723825+00	\N	\N	pending_registration	clt	\N	\N	\N
mem-pedro	Pedro	Operador de Trima	PD	40.0	2026-03-20 01:08:29.723825+00	\N	\N	pending_registration	clt	\N	\N	\N
mem-joaovictor	João Victor	Operador de Trima	JV	40.0	2026-03-20 01:08:29.723825+00	\N	\N	pending_registration	clt	\N	\N	\N
mem-gabriel-t	Gabriel	Operador de Trima	GB	40.0	2026-03-20 01:08:29.723825+00	\N	\N	pending_registration	clt	\N	\N	\N
mem-dra-rebeca	Dra. Rebeca	Advogada	DR	40.0	2026-03-20 01:08:29.723825+00	\N	\N	pending_registration	contract_service	\N	\N	\N
mem-dra-bianca	Dra. Bianca	Advogada	DB	40.0	2026-03-20 01:08:29.723825+00	\N	\N	pending_registration	contract_service	\N	\N	\N
mem-dr-italo	Dr. Ítalo	Advogado	DI	40.0	2026-03-20 01:08:29.723825+00	\N	\N	pending_registration	contract_service	\N	\N	\N
nVq5NE73JzN9et__-h6ki	Marcelo 	Contador	MB	15.0	2026-03-20 13:47:18.348+00	\N	\N	active	contract_service	Marcelo bezerra		+55 88 9905-9668
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, name, sector_id, created_at) FROM stdin;
TCyKmAbJHVgPfhBAIQKOw	Comunicação Febre de Arte	\N	2026-03-19 18:33:00.792+00
haUDQydLrJ6fh0OQqupO6	Jurídico	\N	2026-03-19 19:23:49.787+00
team-tecnologia	Tecnologia	\N	2026-03-20 01:54:11.281457+00
team-contabil	Contábil	\N	2026-03-20 01:54:11.281457+00
WDZVrIVDjLH5LFuHVfAn2	Multirão Sede 30/03	\N	2026-03-20 13:53:43.07+00
\.


--
-- Data for Name: user_passwords; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_passwords (user_id, password_hash, created_at, updated_at) FROM stdin;
1	$2b$10$XGhatQNNMO5E16bE2hLg1eDleiydZHZWFRKkvP9NiVz8M6mosvb.u	2026-03-18 21:46:30.603334+00	2026-03-19 00:43:21.449057+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, display_name, avatar_url, role, created_at, updated_at) FROM stdin;
1	gabriela92dias@gmail.com	Gabriela Dias Fernandes	\N	admin	2026-03-18 21:46:20.906237+00	2026-03-18 21:46:20.906237+00
\.


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brands_id_seq', 1, true);


--
-- Name: login_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_attempts_id_seq', 14, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: budget_items budget_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_items
    ADD CONSTRAINT budget_items_pkey PRIMARY KEY (id);


--
-- Name: campaign_posts campaign_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_posts
    ADD CONSTRAINT campaign_posts_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: executions executions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.executions
    ADD CONSTRAINT executions_pkey PRIMARY KEY (id);


--
-- Name: initiatives initiatives_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives
    ADD CONSTRAINT initiatives_pkey PRIMARY KEY (id);


--
-- Name: login_attempts login_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT login_attempts_pkey PRIMARY KEY (id);


--
-- Name: module_stages module_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_stages
    ADD CONSTRAINT module_stages_pkey PRIMARY KEY (id);


--
-- Name: module_tasks module_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_tasks
    ADD CONSTRAINT module_tasks_pkey PRIMARY KEY (id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: planning_base_items planning_base_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planning_base_items
    ADD CONSTRAINT planning_base_items_pkey PRIMARY KEY (id);


--
-- Name: planning_bases planning_bases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planning_bases
    ADD CONSTRAINT planning_bases_pkey PRIMARY KEY (id);


--
-- Name: project_checklist_items project_checklist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_checklist_items
    ADD CONSTRAINT project_checklist_items_pkey PRIMARY KEY (id);


--
-- Name: project_stages project_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_stages
    ADD CONSTRAINT project_stages_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: sector_members sector_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sector_members
    ADD CONSTRAINT sector_members_pkey PRIMARY KEY (id);


--
-- Name: sector_members sector_members_sector_id_member_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sector_members
    ADD CONSTRAINT sector_members_sector_id_member_id_key UNIQUE (sector_id, member_id);


--
-- Name: sectors sectors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: task_actions task_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_actions
    ADD CONSTRAINT task_actions_pkey PRIMARY KEY (id);


--
-- Name: task_checklist_items task_checklist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_checklist_items
    ADD CONSTRAINT task_checklist_items_pkey PRIMARY KEY (id);


--
-- Name: task_dependencies task_dependencies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_dependencies
    ADD CONSTRAINT task_dependencies_pkey PRIMARY KEY (id);


--
-- Name: task_participants task_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_participants
    ADD CONSTRAINT task_participants_pkey PRIMARY KEY (id);


--
-- Name: task_participants task_participants_task_id_member_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_participants
    ADD CONSTRAINT task_participants_task_id_member_id_key UNIQUE (task_id, member_id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: team_group_members team_group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_group_members
    ADD CONSTRAINT team_group_members_pkey PRIMARY KEY (id);


--
-- Name: team_group_members team_group_members_team_id_member_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_group_members
    ADD CONSTRAINT team_group_members_team_id_member_id_key UNIQUE (team_id, member_id);


--
-- Name: team_members team_members_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_email_key UNIQUE (email);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: task_dependencies unique_dependency; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_dependencies
    ADD CONSTRAINT unique_dependency UNIQUE (task_id, depends_on_task_id);


--
-- Name: user_passwords user_passwords_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_passwords
    ADD CONSTRAINT user_passwords_pkey PRIMARY KEY (user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_activity_logs_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_logs_entity ON public.activity_logs USING btree (entity_type, entity_id);


--
-- Name: idx_activity_logs_performed_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_logs_performed_at ON public.activity_logs USING btree (performed_at DESC);


--
-- Name: idx_activity_logs_project; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_logs_project ON public.activity_logs USING btree (project_id);


--
-- Name: idx_budget_items_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budget_items_category ON public.budget_items USING btree (category);


--
-- Name: idx_budget_items_project_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budget_items_project_id ON public.budget_items USING btree (project_id);


--
-- Name: idx_campaign_posts_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_campaign_posts_campaign_id ON public.campaign_posts USING btree (campaign_id);


--
-- Name: idx_campaigns_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_campaigns_status ON public.campaigns USING btree (status);


--
-- Name: idx_campaigns_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_campaigns_type ON public.campaigns USING btree (type);


--
-- Name: idx_checklist_items_project; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_checklist_items_project ON public.project_checklist_items USING btree (project_id);


--
-- Name: idx_checklist_items_project_title; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_checklist_items_project_title ON public.project_checklist_items USING btree (project_id, title);


--
-- Name: idx_executions_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_executions_action ON public.executions USING btree (task_action_id);


--
-- Name: idx_executions_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_executions_operator ON public.executions USING btree (operator_id);


--
-- Name: idx_executions_started; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_executions_started ON public.executions USING btree (started_at);


--
-- Name: idx_initiatives_assigned_team_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_initiatives_assigned_team_id ON public.initiatives USING btree (assigned_team_id);


--
-- Name: idx_initiatives_responsible; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_initiatives_responsible ON public.initiatives USING btree (responsible_id);


--
-- Name: idx_initiatives_sector_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_initiatives_sector_id ON public.initiatives USING btree (sector_id);


--
-- Name: idx_initiatives_solicitante_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_initiatives_solicitante_id ON public.initiatives USING btree (solicitante_id);


--
-- Name: idx_initiatives_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_initiatives_status ON public.initiatives USING btree (status);


--
-- Name: idx_login_attempts_email_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_login_attempts_email_time ON public.login_attempts USING btree (lower((email)::text), attempted_at DESC) WHERE (success = false);


--
-- Name: idx_login_attempts_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_login_attempts_time ON public.login_attempts USING btree (attempted_at) WHERE (attempted_at IS NOT NULL);


--
-- Name: idx_module_stages_module_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_module_stages_module_id ON public.module_stages USING btree (module_id);


--
-- Name: idx_module_tasks_stage_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_module_tasks_stage_id ON public.module_tasks USING btree (module_stage_id);


--
-- Name: idx_modules_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_modules_name ON public.modules USING btree (name);


--
-- Name: idx_planning_base_items_base_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_planning_base_items_base_id ON public.planning_base_items USING btree (planning_base_id);


--
-- Name: idx_planning_bases_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_planning_bases_type ON public.planning_bases USING btree (type);


--
-- Name: idx_project_stages_assigned_team_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_project_stages_assigned_team_id ON public.project_stages USING btree (assigned_team_id);


--
-- Name: idx_project_stages_project; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_project_stages_project ON public.project_stages USING btree (project_id);


--
-- Name: idx_projects_assigned_team_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_assigned_team_id ON public.projects USING btree (assigned_team_id);


--
-- Name: idx_projects_initiative; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_initiative ON public.projects USING btree (initiative_id);


--
-- Name: idx_projects_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_status ON public.projects USING btree (status);


--
-- Name: idx_sector_members_member; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sector_members_member ON public.sector_members USING btree (member_id);


--
-- Name: idx_sector_members_sector; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sector_members_sector ON public.sector_members USING btree (sector_id);


--
-- Name: idx_sectors_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sectors_name ON public.sectors USING btree (name);


--
-- Name: idx_sessions_last_accessed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_last_accessed ON public.sessions USING btree (last_accessed);


--
-- Name: idx_sessions_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_user_id ON public.sessions USING btree (user_id);


--
-- Name: idx_task_actions_assigned; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_actions_assigned ON public.task_actions USING btree (assigned_to);


--
-- Name: idx_task_actions_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_actions_operator ON public.task_actions USING btree (operator_id);


--
-- Name: idx_task_actions_task; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_actions_task ON public.task_actions USING btree (task_id);


--
-- Name: idx_task_checklist_items_task_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_checklist_items_task_id ON public.task_checklist_items USING btree (task_id);


--
-- Name: idx_task_deps_depends_on; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_deps_depends_on ON public.task_dependencies USING btree (depends_on_task_id);


--
-- Name: idx_task_deps_task; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_deps_task ON public.task_dependencies USING btree (task_id);


--
-- Name: idx_task_participants_member; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_participants_member ON public.task_participants USING btree (member_id);


--
-- Name: idx_task_participants_task; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_participants_task ON public.task_participants USING btree (task_id);


--
-- Name: idx_tasks_assigned_team_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_assigned_team_id ON public.tasks USING btree (assigned_team_id);


--
-- Name: idx_tasks_assignee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_assignee_id ON public.tasks USING btree (assignee_id);


--
-- Name: idx_tasks_project_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_project_id ON public.tasks USING btree (project_id);


--
-- Name: idx_tasks_stage; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_stage ON public.tasks USING btree (stage_id);


--
-- Name: idx_tasks_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_status ON public.tasks USING btree (status);


--
-- Name: idx_team_group_members_member_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_team_group_members_member_id ON public.team_group_members USING btree (member_id);


--
-- Name: idx_team_group_members_team_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_team_group_members_team_id ON public.team_group_members USING btree (team_id);


--
-- Name: idx_team_members_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_team_members_user_id ON public.team_members USING btree (user_id) WHERE (user_id IS NOT NULL);


--
-- Name: idx_teams_sector_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_teams_sector_id ON public.teams USING btree (sector_id);


--
-- Name: activity_logs activity_logs_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: budget_items budget_items_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_items
    ADD CONSTRAINT budget_items_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: campaign_posts campaign_posts_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_posts
    ADD CONSTRAINT campaign_posts_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: executions executions_operator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.executions
    ADD CONSTRAINT executions_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES public.team_members(id) ON DELETE CASCADE;


--
-- Name: executions executions_task_action_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.executions
    ADD CONSTRAINT executions_task_action_id_fkey FOREIGN KEY (task_action_id) REFERENCES public.task_actions(id) ON DELETE CASCADE;


--
-- Name: initiatives initiatives_assigned_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives
    ADD CONSTRAINT initiatives_assigned_team_id_fkey FOREIGN KEY (assigned_team_id) REFERENCES public.teams(id) ON DELETE SET NULL;


--
-- Name: initiatives initiatives_responsible_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives
    ADD CONSTRAINT initiatives_responsible_id_fkey FOREIGN KEY (responsible_id) REFERENCES public.team_members(id) ON DELETE SET NULL;


--
-- Name: initiatives initiatives_sector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives
    ADD CONSTRAINT initiatives_sector_id_fkey FOREIGN KEY (sector_id) REFERENCES public.sectors(id) ON DELETE SET NULL;


--
-- Name: initiatives initiatives_solicitante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives
    ADD CONSTRAINT initiatives_solicitante_id_fkey FOREIGN KEY (solicitante_id) REFERENCES public.team_members(id) ON DELETE SET NULL;


--
-- Name: module_stages module_stages_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_stages
    ADD CONSTRAINT module_stages_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: module_tasks module_tasks_module_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_tasks
    ADD CONSTRAINT module_tasks_module_stage_id_fkey FOREIGN KEY (module_stage_id) REFERENCES public.module_stages(id) ON DELETE CASCADE;


--
-- Name: planning_base_items planning_base_items_planning_base_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planning_base_items
    ADD CONSTRAINT planning_base_items_planning_base_id_fkey FOREIGN KEY (planning_base_id) REFERENCES public.planning_bases(id) ON DELETE CASCADE;


--
-- Name: project_checklist_items project_checklist_items_completed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_checklist_items
    ADD CONSTRAINT project_checklist_items_completed_by_fkey FOREIGN KEY (completed_by) REFERENCES public.team_members(id) ON DELETE SET NULL;


--
-- Name: project_checklist_items project_checklist_items_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_checklist_items
    ADD CONSTRAINT project_checklist_items_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_stages project_stages_assigned_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_stages
    ADD CONSTRAINT project_stages_assigned_team_id_fkey FOREIGN KEY (assigned_team_id) REFERENCES public.teams(id) ON DELETE SET NULL;


--
-- Name: project_stages project_stages_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_stages
    ADD CONSTRAINT project_stages_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: projects projects_assigned_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_assigned_team_id_fkey FOREIGN KEY (assigned_team_id) REFERENCES public.teams(id) ON DELETE SET NULL;


--
-- Name: projects projects_initiative_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_initiative_id_fkey FOREIGN KEY (initiative_id) REFERENCES public.initiatives(id) ON DELETE SET NULL;


--
-- Name: projects projects_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.team_members(id) ON DELETE SET NULL;


--
-- Name: sector_members sector_members_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sector_members
    ADD CONSTRAINT sector_members_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.team_members(id) ON DELETE CASCADE;


--
-- Name: sector_members sector_members_sector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sector_members
    ADD CONSTRAINT sector_members_sector_id_fkey FOREIGN KEY (sector_id) REFERENCES public.sectors(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: task_actions task_actions_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_actions
    ADD CONSTRAINT task_actions_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.team_members(id) ON DELETE SET NULL;


--
-- Name: task_actions task_actions_operator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_actions
    ADD CONSTRAINT task_actions_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES public.team_members(id) ON DELETE SET NULL;


--
-- Name: task_actions task_actions_requested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_actions
    ADD CONSTRAINT task_actions_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES public.team_members(id) ON DELETE SET NULL;


--
-- Name: task_actions task_actions_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_actions
    ADD CONSTRAINT task_actions_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: task_checklist_items task_checklist_items_completed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_checklist_items
    ADD CONSTRAINT task_checklist_items_completed_by_fkey FOREIGN KEY (completed_by) REFERENCES public.team_members(id) ON DELETE SET NULL;


--
-- Name: task_checklist_items task_checklist_items_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_checklist_items
    ADD CONSTRAINT task_checklist_items_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: task_dependencies task_dependencies_depends_on_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_dependencies
    ADD CONSTRAINT task_dependencies_depends_on_task_id_fkey FOREIGN KEY (depends_on_task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: task_dependencies task_dependencies_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_dependencies
    ADD CONSTRAINT task_dependencies_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: task_participants task_participants_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_participants
    ADD CONSTRAINT task_participants_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.team_members(id) ON DELETE CASCADE;


--
-- Name: task_participants task_participants_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_participants
    ADD CONSTRAINT task_participants_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_assigned_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigned_team_id_fkey FOREIGN KEY (assigned_team_id) REFERENCES public.teams(id) ON DELETE SET NULL;


--
-- Name: tasks tasks_assignee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES public.team_members(id) ON DELETE SET NULL;


--
-- Name: tasks tasks_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.project_stages(id) ON DELETE SET NULL;


--
-- Name: team_group_members team_group_members_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_group_members
    ADD CONSTRAINT team_group_members_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.team_members(id) ON DELETE CASCADE;


--
-- Name: team_group_members team_group_members_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_group_members
    ADD CONSTRAINT team_group_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: team_members team_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: teams teams_sector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_sector_id_fkey FOREIGN KEY (sector_id) REFERENCES public.sectors(id) ON DELETE SET NULL;


--
-- Name: user_passwords user_passwords_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_passwords
    ADD CONSTRAINT user_passwords_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict 2MPhV6iH8hlfjdjAMLMpMEA0jdLqBhhWoRYfWXVTN0mMRrVPupvtZKPsNTFX2Gv

