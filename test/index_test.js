import { forEach } from 'lodash';
import { mapData, toFormInputs } from '../src/index';
import validSchema from './fixtures/valid_schema';

describe('.mapData', () => {
  it('must return array of objects', () => {
    const result = mapData(validSchema.sheep, { id: 1 });
    result.must.be.an.array();
    result[0].must.be.an.object();
  });

  it('must return schema prop as undefined if not in data', () => {
    const result = mapData(validSchema.sheep, { id: 1 });
    result[0].must.have.property('name', undefined);
    result[0].must.have.property('attributes.color', undefined);
    result[0].must.have.property('attributes.size', undefined);
  });

  it('must not return nested properties without dot notation', () => {
    const result = mapData(validSchema.sheep, { id: 1 });
    result[0].must.not.have.property('color');
  });

  it('must return dot notation item for nested properties', () => {
    const result = mapData(validSchema.sheep, { id: 1 });
    result[0].must.have.property('attributes.color');
  });

  it('must return link formatted relationship', () => {
    const data = { sheep: 2 };
    const result = mapData(validSchema.wolf, data);
    result[0].sheep.must.eql(`/sheep/${data.sheep}`);
  });

  it('must return formatted array values', () => {
    const data = { name: ['garry', 'larry'] };
    const result = mapData(validSchema.sheep, data);
    result[0].name.must.eql('[garry, larry]');
  });
});

describe('.toFormInputs', () => {
  it('must return an object', () => {
    const data = [
      { id: 1, name: 'garry' },
      { id: 2, name: 'larry' }
    ];
    const result = toFormInputs(validSchema.sheep, data);

    result.must.be.an.object();
  });

  it('must not return type = string', () => {
    const data = { id: 1 };
    const result = toFormInputs(validSchema.sheep, data);

    result.id.type.must.not.eql('string');
  });

  it('must return type = string as type = text', () => {
    const data = { id: 1 };
    const result = toFormInputs(validSchema.sheep, data);

    result.id.type.must.eql('text');
  });

  it('must not return faker property', () => {
    const data = { id: 1 };
    const result = toFormInputs(validSchema.sheep, data);

    result.must.not.have.property('faker');
  });

  it('must return value property', () => {
    const data = { id: 1 };
    const result = toFormInputs(validSchema.sheep, data);

    console.log(result);

    result.id.value.must.be(1);
  });

  it('must not return value property if undefined', () => {
    const data = { id: 1, name: undefined };
    const result = toFormInputs(validSchema.sheep, data);

    result.name.must.not.have.property('value');
  });

  it('must add required property if found in schema', () => {
    const data = { id: 1, name: undefined };
    const result = toFormInputs(validSchema.sheep, data);

    result.name.must.eql({ required: true, type: 'text' });
  });

  it('must not add required property if not required by schema', () => {
    const data = { id: 1, name: undefined };
    const result = toFormInputs(validSchema.sheep, data);

    result.id.must.not.have.property('required');
  });

  it('must return empty value property if no data passed', () => {
    forEach(toFormInputs(validSchema.sheep), val => {
      val.must.not.have.property('value');
    });
  });
});
