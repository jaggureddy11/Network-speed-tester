-- PostgreSQL Database Schema for LibreSpeed SaaS

CREATE TABLE IF NOT EXISTS speed_tests (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    download_speed DOUBLE PRECISION NOT NULL,
    upload_speed DOUBLE PRECISION NOT NULL,
    ping DOUBLE PRECISION NOT NULL,
    jitter DOUBLE PRECISION NOT NULL,
    network_quality VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    ip_address VARCHAR(45),
    isp_name VARCHAR(255),
    device_info VARCHAR(255),
    connection_info VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_speed_tests_user_id ON speed_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_speed_tests_created_at ON speed_tests(created_at);
