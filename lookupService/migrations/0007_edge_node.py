# Generated by Django 3.2.6 on 2021-09-07 10:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lookupService', '0006_alter_job_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Edge',
            fields=[
                ('id', models.CharField(max_length=332, primary_key=True, serialize=False)),
                ('from_node', models.CharField(max_length=168)),
                ('to_node', models.CharField(max_length=168)),
            ],
        ),
        migrations.CreateModel(
            name='Node',
            fields=[
                ('id', models.CharField(max_length=168, primary_key=True, serialize=False)),
                ('text', models.CharField(max_length=168)),
            ],
        ),
    ]
