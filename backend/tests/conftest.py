import pytest
from app.database.seed import init_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    init_db(force_reset=True)
