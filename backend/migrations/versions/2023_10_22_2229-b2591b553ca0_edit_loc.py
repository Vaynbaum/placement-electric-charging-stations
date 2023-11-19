"""Edit loc

Revision ID: b2591b553ca0
Revises: 168fa5b98196
Create Date: 2023-10-22 22:29:01.479730

"""
from alembic import op
import sqlalchemy as sa
import sqlalchemy_bigquery

# revision identifiers, used by Alembic.
revision = 'b2591b553ca0'
down_revision = '168fa5b98196'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('cities', sa.Column('location', sqlalchemy_bigquery.geography.GEOGRAPHY(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('cities', 'location')
    
    # ### end Alembic commands ###
