import os
from tortoise import Tortoise

async def lifespan(_):
    await Tortoise.init(
        db_url=os.environ.get("DATABASE_URL"),
        modules={'models': ['models.user', 'models.prompt']}
    )
    await Tortoise.generate_schemas()
    yield
    await Tortoise.close_connections()