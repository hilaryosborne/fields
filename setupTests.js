import { configure } from 'enzyme';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiShallowDeepEqual);
chai.use(chaiEnzyme);
