import sys, unittest, json, threading
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import server

class PlanTests(unittest.TestCase):
    def test_invalid_briefs(self):
        for brief in [None, [], '', 'short', 'x'*3001]:
            with self.assertRaises(ValueError): server.validate_brief({'brief':brief})
    def test_demo_is_valid_and_uses_brief(self):
        plan=server.validate_plan(server.demo_plan('Айдентика для кофейни у моря'))
        self.assertIn('кофейни',plan['tasks'][0]['description'])
    def test_reject_invalid_ai_plan(self):
        for plan in [{}, {'tasks':[]}, {'tasks':[{'title':'A','description':'B','stage':'published'}]}]:
            with self.assertRaises(ValueError): server.validate_plan(plan)
    def test_ai_adapter_contract(self):
        class Response:
            def __enter__(self):return self
            def __exit__(self,*args):pass
            def read(self):return json.dumps({'status':'completed','output':[{'content':[{'type':'output_text','text':json.dumps(server.demo_plan('тестовый творческий бриф'))}]}]}).encode()
        with patch.dict(server.os.environ,{'OPENAI_API_KEY':'test-key'}),patch('server.urlopen',return_value=Response()) as call:
            self.assertEqual(len(server.ai_plan('тестовый творческий бриф')['tasks']),6)
            payload=json.loads(call.call_args[0][0].data)
            self.assertFalse(payload['store'])
            self.assertEqual(payload['text']['format']['type'],'json_schema')
    def test_refusal_not_silently_replaced(self):
        class Response:
            def __enter__(self):return self
            def __exit__(self,*args):pass
            def read(self):return b'{"status":"incomplete"}'
        with patch.dict(server.os.environ,{'OPENAI_API_KEY':'test-key'}),patch('server.urlopen',return_value=Response()):
            with self.assertRaises(ValueError):server.ai_plan('тестовый творческий бриф')

if __name__=='__main__':unittest.main()
