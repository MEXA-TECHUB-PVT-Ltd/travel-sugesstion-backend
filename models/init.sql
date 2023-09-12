CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    image VARCHAR(255),
    blocked BOOLEAN DEFAULT false,
    code VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS public.question (
    id SERIAL PRIMARY KEY,
    questions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.question_status (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    question_id INTEGER,
    question_status VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (question_id) REFERENCES public.question (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.amenities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.restaurant_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hotel_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cuisine (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.meal (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.place_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.places
(
    id integer NOT NULL DEFAULT nextval('places_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    image character varying(100) COLLATE pg_catalog."default" NOT NULL,
    location point NOT NULL,
    state character varying(50) COLLATE pg_catalog."default" NOT NULL,
    country character varying(50) COLLATE pg_catalog."default" NOT NULL,
    city character varying(50) COLLATE pg_catalog."default" NOT NULL,
    street character varying(100) COLLATE pg_catalog."default" NOT NULL,
    postal_code character varying(20) COLLATE pg_catalog."default",
    website_link text COLLATE pg_catalog."default",
    phone_no character varying(20) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default" NOT NULL,
    amenity_id integer,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    place_type_id integer,
    user_id integer,
    CONSTRAINT places_pkey PRIMARY KEY (id),
    CONSTRAINT fk_place_type_id FOREIGN KEY (place_type_id)
        REFERENCES public.place_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT places_amenity_id_fkey FOREIGN KEY (amenity_id)
        REFERENCES public.amenities (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT user_id_fk FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS public.staff_representative
(
    id integer NOT NULL DEFAULT nextval('staff_representative_id_seq'::regclass),
    role character varying(255) COLLATE pg_catalog."default",
    open character varying(100) COLLATE pg_catalog."default" NOT NULL,
    property_description text COLLATE pg_catalog."default",
    certifying_representative character varying(10) COLLATE pg_catalog."default",
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    place_id integer,
    CONSTRAINT staff_representative_pkey PRIMARY KEY (id),
    CONSTRAINT fk_place_id FOREIGN KEY (place_id)
        REFERENCES public.places (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS public.hotels
(
    id integer NOT NULL DEFAULT nextval('hotels_id_seq'::regclass),
    place_id integer NOT NULL,
    hotel_type integer NOT NULL,
    num_rooms integer NOT NULL,
    staff_desk_availability character varying(10) COLLATE pg_catalog."default" NOT NULL,
    check_in_time time without time zone,
    check_out_time time without time zone,
    housekeeping_availability character varying(10) COLLATE pg_catalog."default" NOT NULL,
    certifying_representative character varying(10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT hotels_pkey PRIMARY KEY (id),
    CONSTRAINT hotels_hotel_type_fkey FOREIGN KEY (hotel_type)
        REFERENCES public.hotel_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT place_id_fk FOREIGN KEY (place_id)
        REFERENCES public.places (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS public.restaurants
(
    id integer NOT NULL DEFAULT nextval('restaurants_id_seq'::regclass),
    place_id integer NOT NULL,
    restaurant_category_id integer NOT NULL,
    open_hours jsonb,
    housekeeping_availability character varying(10) COLLATE pg_catalog."default" NOT NULL,
    certifying_representative character varying(10) COLLATE pg_catalog."default",
    CONSTRAINT restaurants_pkey PRIMARY KEY (id),
    CONSTRAINT restaurants_place_id_fkey FOREIGN KEY (place_id)
        REFERENCES public.places (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT restaurants_restaurant_category_id_fkey FOREIGN KEY (restaurant_category_id)
        REFERENCES public.restaurant_categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
CREATE TABLE IF NOT EXISTS public.restaurant_meal
(
    id integer NOT NULL DEFAULT nextval('restaurant_meal_id_seq'::regclass),
    restaurant_id integer,
    meal_id integer,
    CONSTRAINT restaurant_meal_pkey PRIMARY KEY (id),
    CONSTRAINT restaurant_meal_meal_id_fkey FOREIGN KEY (meal_id)
        REFERENCES public.meal (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT restaurant_meal_restaurant_id_fkey FOREIGN KEY (restaurant_id)
        REFERENCES public.restaurants (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS public.restaurant_cuisine
(
    restaurant_id integer NOT NULL,
    cuisine_id integer NOT NULL,
    CONSTRAINT restaurant_cuisine_pkey PRIMARY KEY (restaurant_id, cuisine_id),
    CONSTRAINT restaurant_cuisine_cuisine_id_fkey FOREIGN KEY (cuisine_id)
        REFERENCES public.cuisine (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT restaurant_cuisine_restaurant_id_fkey FOREIGN KEY (restaurant_id)
        REFERENCES public.restaurants (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.rating
(
    id integer NOT NULL DEFAULT nextval('rating_id_seq'::regclass),
    place_id integer,
    user_id integer,
    no_of_stars integer NOT NULL,
    CONSTRAINT rating_pkey PRIMARY KEY (id),
    CONSTRAINT rating_place_id_fkey FOREIGN KEY (place_id)
        REFERENCES public.places (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT rating_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS public.review
(
    id integer NOT NULL DEFAULT nextval('review_id_seq'::regclass),
    place_id integer,
    user_id integer,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    select_visit character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone,
    CONSTRAINT review_pkey PRIMARY KEY (id),
    CONSTRAINT review_place_id_fkey FOREIGN KEY (place_id)
        REFERENCES public.places (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT review_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS public.saved_places
(
    id integer NOT NULL DEFAULT nextval('saved_places_id_seq'::regclass),
    place_id integer,
    user_id integer,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone,
    CONSTRAINT saved_places_pkey PRIMARY KEY (id),
    CONSTRAINT saved_places_place_id_fkey FOREIGN KEY (place_id)
        REFERENCES public.places (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT saved_places_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS public.upload_place_images
(
    id integer NOT NULL DEFAULT nextval('"uploadPlaceImages_id_seq"'::regclass),
    place_id integer,
    user_id integer,
    image_url text COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uploadPlaceImages_pkey" PRIMARY KEY (id),
    CONSTRAINT "uploadPlaceImages_place_id_fkey" FOREIGN KEY (place_id)
        REFERENCES public.places (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "uploadPlaceImages_user_id_fkey" FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS public.blog
(
    id integer NOT NULL DEFAULT nextval('blog_id_seq'::regclass),
    name character varying(200) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    image_url text COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT blog_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.access_type
(
    id integer NOT NULL DEFAULT nextval('access_type_id_seq'::regclass),
    name character varying(200) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT access_type_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.tips
(
    id integer NOT NULL DEFAULT nextval('tips_id_seq'::regclass),
    place_id integer,
    description text COLLATE pg_catalog."default",
    CONSTRAINT tips_pkey PRIMARY KEY (id),
    CONSTRAINT tips_place_id_fkey FOREIGN KEY (place_id)
        REFERENCES public.places (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS public.user_likes
(
    id integer NOT NULL DEFAULT nextval('user_likes_id_seq'::regclass),
    review_id integer,
    user_id integer,
    review_timestamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone,
    CONSTRAINT user_likes_pkey PRIMARY KEY (id),
    CONSTRAINT user_likes_review_id_fkey FOREIGN KEY (review_id)
        REFERENCES public.review (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT user_likes_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);