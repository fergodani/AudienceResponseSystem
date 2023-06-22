--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-06-22 21:57:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 36084)
-- Name: public; Type: SCHEMA; Schema: -; Owner: dani
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO dani;

--
-- TOC entry 3467 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: dani
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 891 (class 1247 OID 36314)
-- Name: game_type; Type: TYPE; Schema: public; Owner: dani
--

CREATE TYPE public.game_type AS ENUM (
    'offline',
    'online'
);


ALTER TYPE public.game_type OWNER TO dani;

--
-- TOC entry 900 (class 1247 OID 36346)
-- Name: point_type; Type: TYPE; Schema: public; Owner: dani
--

CREATE TYPE public.point_type AS ENUM (
    'standard',
    'double',
    'no_points'
);


ALTER TYPE public.point_type OWNER TO dani;

--
-- TOC entry 858 (class 1247 OID 36095)
-- Name: role; Type: TYPE; Schema: public; Owner: dani
--

CREATE TYPE public.role AS ENUM (
    'student',
    'professor',
    'admin'
);


ALTER TYPE public.role OWNER TO dani;

--
-- TOC entry 897 (class 1247 OID 36335)
-- Name: state; Type: TYPE; Schema: public; Owner: dani
--

CREATE TYPE public.state AS ENUM (
    'created',
    'started',
    'closed'
);


ALTER TYPE public.state OWNER TO dani;

--
-- TOC entry 861 (class 1247 OID 36110)
-- Name: type; Type: TYPE; Schema: public; Owner: dani
--

CREATE TYPE public.type AS ENUM (
    'multioption',
    'true_false',
    'short'
);


ALTER TYPE public.type OWNER TO dani;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 36117)
-- Name: UserCourse; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public."UserCourse" (
    user_id integer NOT NULL,
    course_id integer NOT NULL
);


ALTER TABLE public."UserCourse" OWNER TO dani;

--
-- TOC entry 214 (class 1259 OID 36085)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO dani;

--
-- TOC entry 216 (class 1259 OID 36122)
-- Name: answer; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public.answer (
    description character varying NOT NULL,
    is_correct boolean NOT NULL,
    question_id integer NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.answer OWNER TO dani;

--
-- TOC entry 231 (class 1259 OID 36353)
-- Name: answerResult; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public."answerResult" (
    game_id integer NOT NULL,
    user_id integer NOT NULL,
    answer_id integer,
    question_index integer NOT NULL,
    answered boolean NOT NULL,
    short_answer text,
    question_id integer NOT NULL
);


ALTER TABLE public."answerResult" OWNER TO dani;

--
-- TOC entry 229 (class 1259 OID 36283)
-- Name: answer_id_seq; Type: SEQUENCE; Schema: public; Owner: dani
--

CREATE SEQUENCE public.answer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.answer_id_seq OWNER TO dani;

--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 229
-- Name: answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dani
--

ALTER SEQUENCE public.answer_id_seq OWNED BY public.answer.id;


--
-- TOC entry 217 (class 1259 OID 36134)
-- Name: course; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public.course (
    id integer NOT NULL,
    description character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying NOT NULL
);


ALTER TABLE public.course OWNER TO dani;

--
-- TOC entry 218 (class 1259 OID 36141)
-- Name: courseQuestion; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public."courseQuestion" (
    question_id integer NOT NULL,
    course_id integer NOT NULL
);


ALTER TABLE public."courseQuestion" OWNER TO dani;

--
-- TOC entry 219 (class 1259 OID 36146)
-- Name: courseSurvey; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public."courseSurvey" (
    survey_id integer NOT NULL,
    course_id integer NOT NULL
);


ALTER TABLE public."courseSurvey" OWNER TO dani;

--
-- TOC entry 227 (class 1259 OID 36256)
-- Name: course_id_seq; Type: SEQUENCE; Schema: public; Owner: dani
--

CREATE SEQUENCE public.course_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.course_id_seq OWNER TO dani;

--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 227
-- Name: course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dani
--

ALTER SEQUENCE public.course_id_seq OWNED BY public.course.id;


--
-- TOC entry 221 (class 1259 OID 36152)
-- Name: game; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public.game (
    id integer NOT NULL,
    host_id integer NOT NULL,
    survey_id integer NOT NULL,
    date timestamp(6) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    are_questions_visible boolean,
    state public.state NOT NULL,
    type public.game_type NOT NULL,
    point_type public.point_type NOT NULL,
    course_id integer NOT NULL
);


ALTER TABLE public.game OWNER TO dani;

--
-- TOC entry 230 (class 1259 OID 36319)
-- Name: gameResult; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public."gameResult" (
    game_id integer NOT NULL,
    user_id integer NOT NULL,
    score integer NOT NULL,
    correct_questions integer NOT NULL,
    total_questions integer NOT NULL,
    wrong_questions integer NOT NULL
);


ALTER TABLE public."gameResult" OWNER TO dani;

--
-- TOC entry 220 (class 1259 OID 36151)
-- Name: game_id_seq; Type: SEQUENCE; Schema: public; Owner: dani
--

CREATE SEQUENCE public.game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.game_id_seq OWNER TO dani;

--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 220
-- Name: game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dani
--

ALTER SEQUENCE public.game_id_seq OWNED BY public.game.id;


--
-- TOC entry 222 (class 1259 OID 36158)
-- Name: question; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public.question (
    id integer NOT NULL,
    description character varying NOT NULL,
    subject character varying NOT NULL,
    type public.type NOT NULL,
    answer_time integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    resource text,
    user_creator_id integer NOT NULL
);


ALTER TABLE public.question OWNER TO dani;

--
-- TOC entry 232 (class 1259 OID 36377)
-- Name: questionSurvey; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public."questionSurvey" (
    question_id integer NOT NULL,
    survey_id integer NOT NULL,
    "position" integer NOT NULL
);


ALTER TABLE public."questionSurvey" OWNER TO dani;

--
-- TOC entry 228 (class 1259 OID 36258)
-- Name: question_id_seq; Type: SEQUENCE; Schema: public; Owner: dani
--

CREATE SEQUENCE public.question_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.question_id_seq OWNER TO dani;

--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 228
-- Name: question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dani
--

ALTER SEQUENCE public.question_id_seq OWNED BY public.question.id;


--
-- TOC entry 224 (class 1259 OID 36166)
-- Name: survey; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public.survey (
    id integer NOT NULL,
    title character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_creator_id integer,
    resource text
);


ALTER TABLE public.survey OWNER TO dani;

--
-- TOC entry 223 (class 1259 OID 36165)
-- Name: survey_id_seq; Type: SEQUENCE; Schema: public; Owner: dani
--

CREATE SEQUENCE public.survey_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.survey_id_seq OWNER TO dani;

--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 223
-- Name: survey_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dani
--

ALTER SEQUENCE public.survey_id_seq OWNED BY public.survey.id;


--
-- TOC entry 226 (class 1259 OID 36175)
-- Name: user; Type: TABLE; Schema: public; Owner: dani
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    role public.role NOT NULL
);


ALTER TABLE public."user" OWNER TO dani;

--
-- TOC entry 225 (class 1259 OID 36174)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: dani
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO dani;

--
-- TOC entry 3474 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dani
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 3243 (class 2604 OID 36284)
-- Name: answer id; Type: DEFAULT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.answer ALTER COLUMN id SET DEFAULT nextval('public.answer_id_seq'::regclass);


--
-- TOC entry 3244 (class 2604 OID 36257)
-- Name: course id; Type: DEFAULT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.course ALTER COLUMN id SET DEFAULT nextval('public.course_id_seq'::regclass);


--
-- TOC entry 3246 (class 2604 OID 36155)
-- Name: game id; Type: DEFAULT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.game ALTER COLUMN id SET DEFAULT nextval('public.game_id_seq'::regclass);


--
-- TOC entry 3248 (class 2604 OID 36259)
-- Name: question id; Type: DEFAULT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.question ALTER COLUMN id SET DEFAULT nextval('public.question_id_seq'::regclass);


--
-- TOC entry 3250 (class 2604 OID 36169)
-- Name: survey id; Type: DEFAULT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.survey ALTER COLUMN id SET DEFAULT nextval('public.survey_id_seq'::regclass);


--
-- TOC entry 3252 (class 2604 OID 36178)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3444 (class 0 OID 36117)
-- Dependencies: 215
-- Data for Name: UserCourse; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public."UserCourse" (user_id, course_id) FROM stdin;
\.


--
-- TOC entry 3443 (class 0 OID 36085)
-- Dependencies: 214
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
b7c52d26-46da-468a-bdf6-39078cee5323	bbb5422b2f35a1e18c87f2dab48c982a542c467a191e5b6096c5b779407f9d50	2023-03-27 10:19:33.782344+02	20230215152418_init	\N	\N	2023-03-27 10:19:33.743809+02	1
698825d6-aa60-4b00-ab1d-474d776fa0b2	d733144c985d111fcf5df8f689b635a1c7e95745e47df2c3bfc4949a5880ae6e	2023-03-27 10:19:33.821354+02	20230311164547_init	\N	\N	2023-03-27 10:19:33.82039+02	1
90508bfd-1948-420b-aa68-7971fda0bcff	8e3aa5e994a08cf3448f96e5539de2aa3ed31aa474ba1cadcca5ed5850b32519	2023-03-27 10:19:33.785155+02	20230216173110_init	\N	\N	2023-03-27 10:19:33.782739+02	1
da0bf123-767f-44c0-9ea5-f983723bf917	adafd50b80088d26e4a99ffc06b81551639c925c0429501ae55456c0a5ef93e4	2023-03-27 10:19:33.786773+02	20230216180544_init	\N	\N	2023-03-27 10:19:33.785515+02	1
28e506c0-6e79-4ccd-ade7-baf2e912315e	9889afe914d6e6a1112c0099bb9ad0444c6ed8969399c2c1bc106662dd44c86e	2023-03-27 10:19:33.850263+02	20230320163819_init	\N	\N	2023-03-27 10:19:33.849363+02	1
e6ec9e87-698d-4834-adb2-8e914bfbe1e2	e42d5e146ed5c6c78cd3ce1f34a74b767708c928e35406de8b30b61d8e3e5ed5	2023-03-27 10:19:33.790171+02	20230216182940_init	\N	\N	2023-03-27 10:19:33.787105+02	1
2b8bfb85-fde5-4219-badf-45f73827e003	5f2e88d03e352a1841f104bfb9b07288c61617a6703bf71a143dca66f9f83809	2023-03-27 10:19:33.828217+02	20230311170338_init	\N	\N	2023-03-27 10:19:33.821722+02	1
080afe4d-0d7a-433f-a14e-cd9626ed24e0	6d3316eca2d38c10aea7353401efc62c3a6a4d5eed1a5efaabc91c7c1ee79d39	2023-03-27 10:19:33.791585+02	20230216183057_init	\N	\N	2023-03-27 10:19:33.79052+02	1
2f441d6d-b88c-4a7f-9b01-bef14fd4a37d	0bf01bc890a31bdc165e9ef35820e616f67b6d68ed51a7105d3f8c623f3e8dd1	2023-03-27 10:19:33.794853+02	20230216183204_init	\N	\N	2023-03-27 10:19:33.791959+02	1
15efb0ce-63ee-4d03-8460-1d8a109128dd	fb3ea95987961b6966f086339b56e94d875f1100259f5d2929a31daab2e3c92b	2023-03-27 10:19:33.799924+02	20230307100055_init	\N	\N	2023-03-27 10:19:33.795258+02	1
af34a09b-57da-411a-9e57-f557090643ed	1972c5f6abc9a0f155cfd99ced0ba265abe3a15d5998eb3ba44a1754c823ca24	2023-03-27 10:19:33.831054+02	20230315141437_init	\N	\N	2023-03-27 10:19:33.828592+02	1
d74331c2-03ea-4ba7-be73-65b648bdf479	48df5d5a66b4747f3b9a9d4850c7c3cb62a8f8ef89280441bf86d9efec993d4c	2023-03-27 10:19:33.803833+02	20230307112524_init	\N	\N	2023-03-27 10:19:33.800277+02	1
1ca9863c-cdda-4846-b2ba-51de3671a326	77c1b57887a32cf2dbb1f3470e2ccdf5f046085b2b096735aa35e3165af3cd8c	2023-03-27 10:19:33.806058+02	20230307112628_init	\N	\N	2023-03-27 10:19:33.804193+02	1
44b2f117-d8b3-4522-ae85-da677894e800	d206fc271284ea06696621b0090ba9dfd6f10e1bb3492ce8a3c6010327d24fb0	2023-03-27 10:19:33.813838+02	20230307123532_init	\N	\N	2023-03-27 10:19:33.806401+02	1
6419b502-1e71-4795-9abf-0a9f79826b80	2fa53fe532bf7be5b7c1ccd284d1856e1bafde597ce3dd328d94470d4276d017	2023-03-27 10:19:33.835781+02	20230315172152_init	\N	\N	2023-03-27 10:19:33.831448+02	1
a577155d-fde6-4479-ac10-3dff287c32a0	8b22727aa5034bf3cd636703d5a250885419c95e531ecbf74eedd73e27ed2e8e	2023-03-27 10:19:33.815153+02	20230308172403_init	\N	\N	2023-03-27 10:19:33.814191+02	1
c93bff73-4cf5-4016-9825-efe307fe72de	e4d816f3da1fb514e465b2eed49b07befb47107acb7af0a73656392c81ca94aa	2023-03-27 10:19:33.817563+02	20230310104737_init	\N	\N	2023-03-27 10:19:33.815486+02	1
293e0a26-3d9d-4587-b8ab-6f091ed31315	393f17631e0f4def71dd0b183d6117f237f208474f4ab0e8394c14c4a382ddfc	2023-03-27 10:19:33.853334+02	20230325123350_init	\N	\N	2023-03-27 10:19:33.850585+02	1
9fb1e451-6d45-40c8-a19a-405e2c54b2d1	234dc1d413bde0bf4885767e6b977a478bce2837b958570c41f8352a15ba6e66	2023-03-27 10:19:33.818778+02	20230311101511_init	\N	\N	2023-03-27 10:19:33.817908+02	1
6c437fa4-6db0-4c12-82d6-093a8962cef8	91086b223f37b437ee8ac874a8350d963677e931503d393d3a8ecdf96c6f983c	2023-03-27 10:19:33.840075+02	20230316101125_init	\N	\N	2023-03-27 10:19:33.83613+02	1
96dabb63-ba58-4799-be88-20367e88dd61	a9547c45bdd090964c84e71b3572768d510b70f0fa644088a167c8ea5fe07a0c	2023-03-27 10:19:33.820064+02	20230311163902_init	\N	\N	2023-03-27 10:19:33.819106+02	1
0feb319d-98b2-4a0e-bee3-03ee548b6ab9	d64cfc895f6966de960016c53c37c931f2d148dd73094c21a6c29c805210220a	2023-03-27 10:19:33.841492+02	20230316101834_init	\N	\N	2023-03-27 10:19:33.840476+02	1
63195864-80d3-434d-a63a-802f2ecf9215	64293479a5ac66a06324d28ef258db9b31ed49878ef409daa898a46bef8a456b	2023-04-22 16:39:22.596259+02	20230422143922_init	\N	\N	2023-04-22 16:39:22.591888+02	1
8f3d64c4-ef09-4a19-ae29-331f7dad4c05	bad5af8716832dc98a343f880914188c70d5130fab8622bfd55b62b60897a58c	2023-03-27 10:19:33.842757+02	20230316101909_init	\N	\N	2023-03-27 10:19:33.841866+02	1
d58ffa9c-2319-42ce-b107-b542ed287111	c9e384978828388d0b9c01c17f690830c06bea7591a65b65ad31c6a87f1356f4	2023-03-27 10:19:33.855297+02	20230325125918_init	\N	\N	2023-03-27 10:19:33.853696+02	1
9a308266-8db7-41c8-baeb-e20cb6db9b5b	501f6b0ccb26db228028ba14fe1e6edcc0925aa186916913940f243efcb8f308	2023-03-27 10:19:33.844092+02	20230316102855_init	\N	\N	2023-03-27 10:19:33.843109+02	1
328418df-fdd9-4e49-9a69-b90182741903	f0dd9cf8cae6a845fc138a4edf51bf9e54a6b849e65930687eaea15dfcbc786c	2023-03-27 10:19:33.848999+02	20230320160758_init	\N	\N	2023-03-27 10:19:33.844415+02	1
9bbad5a8-cf50-40dd-a79e-fb5240208900	f0ce3b8656bf6f281f423cb6ed173cdf3156e1ed91651a5e8061e2850dac0415	2023-03-27 10:19:33.858773+02	20230325130005_init	\N	\N	2023-03-27 10:19:33.855628+02	1
44927a63-236d-4155-9ee1-ae1b4b8ff13c	e4c23c1d58144c094a86291d23c9aca21e8233df289aa882dca42777606b382b	2023-03-27 10:19:33.864249+02	20230325162404_init	\N	\N	2023-03-27 10:19:33.85913+02	1
a39ae2fc-dba2-454d-bdf6-c81a001bd912	819e5dacbb911ac5116b828c657f3800f3b97e4e9380c8f54ea0ecc0392b5c99	2023-06-22 20:12:11.063956+02	20230617144501_init	\N	\N	2023-06-22 20:12:11.052633+02	1
015b13f2-6702-4413-977b-91e718ed3bed	3818b909e96abfe796937549353b68c04388562353f7bc7bd0490c50a4cc3ad9	2023-03-27 10:19:33.873855+02	20230325162836_init	\N	\N	2023-03-27 10:19:33.86461+02	1
20d8ef2a-2227-4030-a1ce-864643d49a75	edeade51da3768c2d6b3759d1cff2af584474f8f1639b9044a42a803548f5779	2023-06-22 20:12:11.065874+02	20230619164651_init	\N	\N	2023-06-22 20:12:11.06436+02	1
7a08dc8c-312e-4a2f-ac33-feb8808514a9	cde2f4ebf500308013a08ff4c91d2b956ca48c994d2e7bb4de5d30dffcb54768	2023-06-22 20:12:11.106655+02	20230620081312_init	\N	\N	2023-06-22 20:12:11.066219+02	1
\.


--
-- TOC entry 3445 (class 0 OID 36122)
-- Dependencies: 216
-- Data for Name: answer; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public.answer (description, is_correct, question_id, id) FROM stdin;
\.


--
-- TOC entry 3460 (class 0 OID 36353)
-- Dependencies: 231
-- Data for Name: answerResult; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public."answerResult" (game_id, user_id, answer_id, question_index, answered, short_answer, question_id) FROM stdin;
\.


--
-- TOC entry 3446 (class 0 OID 36134)
-- Dependencies: 217
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public.course (id, description, created_at, name) FROM stdin;
\.


--
-- TOC entry 3447 (class 0 OID 36141)
-- Dependencies: 218
-- Data for Name: courseQuestion; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public."courseQuestion" (question_id, course_id) FROM stdin;
\.


--
-- TOC entry 3448 (class 0 OID 36146)
-- Dependencies: 219
-- Data for Name: courseSurvey; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public."courseSurvey" (survey_id, course_id) FROM stdin;
\.


--
-- TOC entry 3450 (class 0 OID 36152)
-- Dependencies: 221
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public.game (id, host_id, survey_id, date, created_at, are_questions_visible, state, type, point_type, course_id) FROM stdin;
\.


--
-- TOC entry 3459 (class 0 OID 36319)
-- Dependencies: 230
-- Data for Name: gameResult; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public."gameResult" (game_id, user_id, score, correct_questions, total_questions, wrong_questions) FROM stdin;
\.


--
-- TOC entry 3451 (class 0 OID 36158)
-- Dependencies: 222
-- Data for Name: question; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public.question (id, description, subject, type, answer_time, created_at, resource, user_creator_id) FROM stdin;
\.


--
-- TOC entry 3461 (class 0 OID 36377)
-- Dependencies: 232
-- Data for Name: questionSurvey; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public."questionSurvey" (question_id, survey_id, "position") FROM stdin;
\.


--
-- TOC entry 3453 (class 0 OID 36166)
-- Dependencies: 224
-- Data for Name: survey; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public.survey (id, title, created_at, user_creator_id, resource) FROM stdin;
\.


--
-- TOC entry 3455 (class 0 OID 36175)
-- Dependencies: 226
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: dani
--

COPY public."user" (id, username, password, created_at, role) FROM stdin;
\.


--
-- TOC entry 3475 (class 0 OID 0)
-- Dependencies: 229
-- Name: answer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dani
--

SELECT pg_catalog.setval('public.answer_id_seq', 1606, true);


--
-- TOC entry 3476 (class 0 OID 0)
-- Dependencies: 227
-- Name: course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dani
--

SELECT pg_catalog.setval('public.course_id_seq', 219, true);


--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 220
-- Name: game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dani
--

SELECT pg_catalog.setval('public.game_id_seq', 162, true);


--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 228
-- Name: question_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dani
--

SELECT pg_catalog.setval('public.question_id_seq', 404, true);


--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 223
-- Name: survey_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dani
--

SELECT pg_catalog.setval('public.survey_id_seq', 25, true);


--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dani
--

SELECT pg_catalog.setval('public.user_id_seq', 1097, true);


--
-- TOC entry 3257 (class 2606 OID 36121)
-- Name: UserCourse UserCourse_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."UserCourse"
    ADD CONSTRAINT "UserCourse_pkey" PRIMARY KEY (user_id, course_id);


--
-- TOC entry 3255 (class 2606 OID 36093)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3279 (class 2606 OID 36376)
-- Name: answerResult answerResult_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."answerResult"
    ADD CONSTRAINT "answerResult_pkey" PRIMARY KEY (game_id, user_id, question_id);


--
-- TOC entry 3259 (class 2606 OID 36286)
-- Name: answer answer_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_pkey PRIMARY KEY (id);


--
-- TOC entry 3264 (class 2606 OID 36145)
-- Name: courseQuestion courseQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."courseQuestion"
    ADD CONSTRAINT "courseQuestion_pkey" PRIMARY KEY (question_id, course_id);


--
-- TOC entry 3266 (class 2606 OID 36150)
-- Name: courseSurvey courseSurvey_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."courseSurvey"
    ADD CONSTRAINT "courseSurvey_pkey" PRIMARY KEY (survey_id, course_id);


--
-- TOC entry 3262 (class 2606 OID 36140)
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);


--
-- TOC entry 3277 (class 2606 OID 36323)
-- Name: gameResult gameResult_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."gameResult"
    ADD CONSTRAINT "gameResult_pkey" PRIMARY KEY (game_id, user_id);


--
-- TOC entry 3268 (class 2606 OID 36157)
-- Name: game game_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_pkey PRIMARY KEY (id);


--
-- TOC entry 3281 (class 2606 OID 36381)
-- Name: questionSurvey questionSurvey_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."questionSurvey"
    ADD CONSTRAINT "questionSurvey_pkey" PRIMARY KEY (question_id, survey_id);


--
-- TOC entry 3270 (class 2606 OID 36164)
-- Name: question question_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_pkey PRIMARY KEY (id);


--
-- TOC entry 3272 (class 2606 OID 36173)
-- Name: survey survey_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.survey
    ADD CONSTRAINT survey_pkey PRIMARY KEY (id);


--
-- TOC entry 3274 (class 2606 OID 36182)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3260 (class 1259 OID 36260)
-- Name: course_name_key; Type: INDEX; Schema: public; Owner: dani
--

CREATE UNIQUE INDEX course_name_key ON public.course USING btree (name);


--
-- TOC entry 3275 (class 1259 OID 36248)
-- Name: user_username_key; Type: INDEX; Schema: public; Owner: dani
--

CREATE UNIQUE INDEX user_username_key ON public."user" USING btree (username);


--
-- TOC entry 3282 (class 2606 OID 36392)
-- Name: UserCourse UserCourse_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."UserCourse"
    ADD CONSTRAINT "UserCourse_course_id_fkey" FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE;


--
-- TOC entry 3283 (class 2606 OID 36397)
-- Name: UserCourse UserCourse_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."UserCourse"
    ADD CONSTRAINT "UserCourse_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3296 (class 2606 OID 36442)
-- Name: answerResult answerResult_answer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."answerResult"
    ADD CONSTRAINT "answerResult_answer_id_fkey" FOREIGN KEY (answer_id) REFERENCES public.answer(id) ON DELETE CASCADE;


--
-- TOC entry 3297 (class 2606 OID 36358)
-- Name: answerResult answerResult_game_id_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."answerResult"
    ADD CONSTRAINT "answerResult_game_id_user_id_fkey" FOREIGN KEY (game_id, user_id) REFERENCES public."gameResult"(game_id, user_id) ON DELETE CASCADE;


--
-- TOC entry 3298 (class 2606 OID 36447)
-- Name: answerResult answerResult_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."answerResult"
    ADD CONSTRAINT "answerResult_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.question(id) ON DELETE CASCADE;


--
-- TOC entry 3284 (class 2606 OID 36278)
-- Name: answer answer_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.question(id) ON DELETE CASCADE;


--
-- TOC entry 3285 (class 2606 OID 36402)
-- Name: courseQuestion courseQuestion_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."courseQuestion"
    ADD CONSTRAINT "courseQuestion_course_id_fkey" FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE;


--
-- TOC entry 3286 (class 2606 OID 36407)
-- Name: courseQuestion courseQuestion_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."courseQuestion"
    ADD CONSTRAINT "courseQuestion_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.question(id) ON DELETE CASCADE;


--
-- TOC entry 3287 (class 2606 OID 36422)
-- Name: courseSurvey courseSurvey_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."courseSurvey"
    ADD CONSTRAINT "courseSurvey_course_id_fkey" FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE;


--
-- TOC entry 3288 (class 2606 OID 36427)
-- Name: courseSurvey courseSurvey_survey_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."courseSurvey"
    ADD CONSTRAINT "courseSurvey_survey_id_fkey" FOREIGN KEY (survey_id) REFERENCES public.survey(id) ON DELETE CASCADE;


--
-- TOC entry 3294 (class 2606 OID 36437)
-- Name: gameResult gameResult_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."gameResult"
    ADD CONSTRAINT "gameResult_game_id_fkey" FOREIGN KEY (game_id) REFERENCES public.game(id) ON DELETE CASCADE;


--
-- TOC entry 3295 (class 2606 OID 36432)
-- Name: gameResult gameResult_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."gameResult"
    ADD CONSTRAINT "gameResult_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3289 (class 2606 OID 43772)
-- Name: game game_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id);


--
-- TOC entry 3290 (class 2606 OID 36228)
-- Name: game game_host_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_host_id_fkey FOREIGN KEY (host_id) REFERENCES public."user"(id);


--
-- TOC entry 3291 (class 2606 OID 36233)
-- Name: game game_survey_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_survey_id_fkey FOREIGN KEY (survey_id) REFERENCES public.survey(id);


--
-- TOC entry 3299 (class 2606 OID 36412)
-- Name: questionSurvey questionSurvey_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."questionSurvey"
    ADD CONSTRAINT "questionSurvey_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.question(id) ON DELETE CASCADE;


--
-- TOC entry 3300 (class 2606 OID 36417)
-- Name: questionSurvey questionSurvey_survey_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public."questionSurvey"
    ADD CONSTRAINT "questionSurvey_survey_id_fkey" FOREIGN KEY (survey_id) REFERENCES public.survey(id) ON DELETE CASCADE;


--
-- TOC entry 3292 (class 2606 OID 36293)
-- Name: question question_user_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_user_creator_id_fkey FOREIGN KEY (user_creator_id) REFERENCES public."user"(id);


--
-- TOC entry 3293 (class 2606 OID 36243)
-- Name: survey survey_user_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dani
--

ALTER TABLE ONLY public.survey
    ADD CONSTRAINT survey_user_creator_id_fkey FOREIGN KEY (user_creator_id) REFERENCES public."user"(id);


--
-- TOC entry 3468 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: dani
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2023-06-22 21:57:20

--
-- PostgreSQL database dump complete
--

