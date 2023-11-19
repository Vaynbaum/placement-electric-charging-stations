"""Edit city

Revision ID: 0c06a24021bd
Revises: b2591b553ca0
Create Date: 2023-10-23 21:16:33.002492

"""
from alembic import op
import sqlalchemy as sa
import sqlalchemy_bigquery


# revision identifiers, used by Alembic.
revision = '0c06a24021bd'
down_revision = 'b2591b553ca0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('cities', sa.Column('geometry', sqlalchemy_bigquery.geography.GEOGRAPHY(), nullable=True))
    op.add_column('cities', sa.Column('type', sa.String(length=255), nullable=True))
    op.add_column('cities', sa.Column('north', sa.Float(), nullable=True))
    op.add_column('cities', sa.Column('south', sa.Float(), nullable=True))
    op.add_column('cities', sa.Column('east', sa.Float(), nullable=True))
    op.add_column('cities', sa.Column('west', sa.Float(), nullable=True))
    op.add_column('cities', sa.Column('display_name', sa.String(length=255), nullable=True))
    op.add_column('cities', sa.Column('importance', sa.Float(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('cities', 'importance')
    op.drop_column('cities', 'display_name')
    op.drop_column('cities', 'west')
    op.drop_column('cities', 'east')
    op.drop_column('cities', 'south')
    op.drop_column('cities', 'north')
    op.drop_column('cities', 'type')
    op.drop_column('cities', 'geometry')
    
    # ### end Alembic commands ###
